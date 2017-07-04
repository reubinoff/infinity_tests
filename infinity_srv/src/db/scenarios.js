var winston = require('winston');
var mongoose = require('mongoose');
var Scenario = mongoose.model('Scenario');
var _ = require('lodash')
const errors = require('../lobby/error')
const Step = mongoose.model('Step');

var getAll = function() {
    return new Promise(function(resolve, reject) {
        Scenario.find().populate("steps.step").sort({ name: 1 })
            .then((scenarios) => {
                resolve(scenarios.sort('name'));
            })
            .catch((err) => { reject(err) });
    });
}


var getById = function(id) {
    return new Promise(function(resolve, reject) {
        Scenario.findOne({ _id: id }).populate("steps.step")
            .then((scenario) => {
                if (_.isNull(scenario)) { return reject(new errors.InfinityNotFoundError(id)) }
                resolve(scenario);
            })
            .catch((err) => { reject(err) });
    });
}


var update_by_id = function(id, scenario_doc) {
    return new Promise(function(resolve, reject) {
        res = Scenario.findOneAndUpdate({ _id: id }, { $set: scenario_doc }, {
            new: true,
            fields: {
                name: true,
                description: true,
                flow: true,
                steps: true
            }
        }, function(err, doc) {
            if (err) return reject(err)
            if (_.isNull(doc)) { return reject(new errors.InfinityNotFoundError(doc.name)) }
            resolve(doc)
        });
    })
}

var insert = function(scenario_doc) {
    return new Promise(function(resolve, reject) {
        Scenario.find({ name: scenario_doc.name }, function(err, doc) {
            if (err) { return reject(err) }
            if (_.size(doc) == 0) {
                var new_scenario = new Scenario(scenario_doc)
                new_scenario
                    .populate("steps.step")
                    .save()
                    .then((rec) => {
                        resolve(rec)
                    })
                    .catch((err) => {
                        return reject(new errors.InfinityInvalidFormatError(JSON.stringify(err.errors), "Scenario"))
                    });
            } else {
                reject(new errors.InfinityKeyExistError(doc[0]._id))
            }

        })
    });
}


var del = function(id) {
    return new Promise(function(resolve, reject) {
        Scenario.findByIdAndRemove(id, function(err, res) {
            if (err) { return reject(err) }
            if (_.isNull(res)) { return reject(new errors.InfinityNotFoundError(id)) }
            resolve(res);
        })
    });
}


module.exports.getById = getById
module.exports.getAll = getAll
module.exports.insert = insert
module.exports.update_by_id = update_by_id

module.exports.delete = del
module.exports.model = Scenario