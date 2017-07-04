var winston = require('winston');
var mongoose = require('mongoose');
var Step = mongoose.model('Step');
var _ = require('lodash')
const errors = require('../lobby/error')


var getAll = function() {
    return new Promise(function(resolve, reject) {
        Step.find().sort({ name: 1 })
            .then((steps) => {
                resolve(steps.sort('name'));
            })
            .catch((err) => { reject(err) });
    });
}

var getById = function(id) {
    return new Promise(function(resolve, reject) {
        Step.findOne({ _id: id })
            .then((step) => {
                resolve(step);
            })
            .catch((err) => { reject(err) });
    });
}


var update_by_id = function(id, step_doc) {
    return new Promise(function(resolve, reject) {
        res = Step.findOneAndUpdate({ _id: id }, { $set: step_doc }, {
            new: true,
            fields: {
                name: true,
                description: true,
                args: true,
                return_val: true
            }
        }, function(err, doc) {
            if (err) return reject(err)
            if (_.isNull(doc)) { return reject(new errors.InfinityNotFoundError(step_doc.name)) }
            resolve(doc)
        });
    })
}

var insert = function(step_doc) {
    return new Promise(function(resolve, reject) {
        Step.find({ name: step_doc.name }, function(err, doc) {
            if (err) { return reject(err) }
            if (_.size(doc) == 0) {
                var new_step = new Step(step_doc)
                new_step.save()
                    .then((rec) => { resolve(rec) })
                    .catch((err) => {
                        return reject(new errors.InfinityInvalidFormatError(JSON.stringify(err.errors), "Step"))
                    });
            } else {
                reject(new errors.InfinityKeyExistError(doc[0]._id))
            }

        })
    });
}


var del = function(id) {
    return new Promise(function(resolve, reject) {
        Step.findByIdAndRemove(id, function(err, res) {
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