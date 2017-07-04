var winston = require('winston');
var mongoose = require('mongoose');
var Result = mongoose.model('Result');
var _ = require('lodash')
const errors = require('../lobby/error')
const Step = mongoose.model('Step');

var getAll = function() {
    return new Promise(function(resolve, reject) {
        Result.find().populate("execution")
            .then((results) => {
                resolve(results);
            })
            .catch((err) => { reject(err) });
    });
}


var getById = function(id) {
    return new Promise(function(resolve, reject) {
        Result.findOne({ _id: id }).populate("execution")
            .then((result) => {
                if (_.isNull(result)) { return reject(new errors.InfinityNotFoundError(id)) }
                resolve(result);
            })
            .catch((err) => { reject(err) });
    });
}


var update_by_id = function(id, res_doc) {
    return new Promise(function(resolve, reject) {
        res = Result.findOneAndUpdate({ _id: id }, { $set: res_doc }, {
            new: true,
            fields: {
                execution: true,
                result: true
            }
        }, function(err, doc) {
            if (err) return reject(err)
            if (_.isNull(doc)) {
                return reject(new errors.InfinityNotFoundError(id))
            }
            resolve(doc)
        });
    })
}

var insert = function(result) {
    return new Promise(function(resolve, reject) {
        var result_doc = new Result(result)
        result_doc
            .save()
            .then((rec) => {
                if (_.isNull(result)) { return reject(new errors.InfinityNotFoundError(id)) }
                resolve(rec)
            })
            .catch((err) => {
                return reject(new errors.InfinityInvalidFormatError(JSON.stringify(err.errors), "Result"))
            });
    });
}


var del = function(id) {
    return new Promise(function(resolve, reject) {
        Result.findByIdAndRemove(id, function(err, res) {
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