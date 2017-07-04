var winston = require('winston');
var mongoose = require('mongoose');
var Execution = mongoose.model('Execution');
var Account = mongoose.model('Account');
var _ = require('lodash')
const errors = require('../lobby/error')


var getAll = function() {
    return new Promise(function(resolve, reject) {
        Execution.find().sort({ name: 1 })
            .populate({
                path: 'entry_env',
                model: 'Core'
            })
            .populate({
                path: 'cores',
                model: 'Core'
            })
            .populate({
                path: 'test',
                model: 'Test'
            })
            .exec(function(err, executions) {
                if (err) { reject(err) }
                resolve(executions);
            })
    })
}


var getById = function(id) {
    return new Promise(function(resolve, reject) {
        Execution.findOne({ _id: id })
            .populate({
                path: 'entry_env',
                model: 'Core'
            })
            .populate({
                path: 'cores',
                model: 'Core'
            })
            .populate({
                path: 'user',
                model: 'Account'
            })
            .populate({
                path: 'test',
                model: 'Test',
                populate: {
                    path: 'scenarios',
                    model: 'Scenario',
                    populate: {
                        path: 'steps.step',
                        model: 'Step'
                    }
                }
            })

        .then((execution) => {
                if (_.isNull(execution)) { return reject(new errors.InfinityNotFoundError(id)) }
                resolve(execution);
            })
            .catch((err) => { reject(err) });
    });
}


var update_by_id = function(id, execution_doc) {
    return new Promise(function(resolve, reject) {
        res = Execution.findOneAndUpdate({ _id: id }, { $set: execution_doc }, {
            new: true,
            fields: {
                name: true,
                entry_env: true,
                cores: true,
                test: true
            }
        }, function(err, doc) {
            if (err) return reject(err)
            if (_.isNull(doc)) { return reject(new errors.InfinityNotFoundError(execution_doc.name)) }
            resolve(doc)
        });
    })
}

var insert = function(execution_doc) {
    return new Promise(function(resolve, reject) {
        Account.findOne({ username: execution_doc.user },
            function(err, user) {
                if (err) { return reject(new errors.InfinityUserFoundError(execution_doc.user)) }
                execution_doc.user = user._id.toHexString()
                Execution.find({ name: execution_doc.name }, function(err, doc) {
                    if (err) { return reject(err) }
                    if (_.size(doc) == 0) {
                        var new_execution = new Execution(execution_doc)
                        new_execution
                            .save()
                            .then((rec) => {
                                rec.user = undefined
                                resolve(rec)
                            })
                            .catch((err) => {
                                return reject(new errors.InfinityInvalidFormatError(JSON.stringify(err.errors), "Execution"))
                            });
                    } else {
                        reject(new errors.InfinityKeyExistError(doc[0]._id))
                    }
                })
            })
    });
}


var del = function(id) {
    return new Promise(function(resolve, reject) {
        Execution.findByIdAndRemove(id, function(err, res) {
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
module.exports.model = Execution