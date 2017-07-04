var winston = require('winston');
var mongoose = require('mongoose');
var Test = mongoose.model('Test');
var _ = require('lodash')
const errors = require('../lobby/error')


var getAll = function() {
    return new Promise(function(resolve, reject) {
        Test.find().sort({ name: 1 }).populate({
            path: 'scenarios',
            model: 'Scenario',
            populate: {
                path: 'steps.step',
                model: 'Step'
            }
        }).exec(function(err, tests) {
            if (err) { reject(err) }
            resolve(tests.sort('name'));
        })
    })
}


var getById = function(id) {
    return new Promise(function(resolve, reject) {
        Test.findOne({ _id: id }).populate({
                path: 'scenarios',
                model: 'Scenario',
                populate: {
                    path: 'steps.step',
                    model: 'Step'
                }
            })
            .then((test) => {
                if (_.isNull(test)) { return reject(new errors.InfinityNotFoundError(id)) }
                resolve(test);
            })
            .catch((err) => { reject(err) });
    });
}


var update_by_id = function(id, test_doc) {
    return new Promise(function(resolve, reject) {
        res = Test.findOneAndUpdate({ _id: id }, { $set: test_doc }, {
            new: true,
            fields: {
                name: true,
                description: true,
                flow: true,
                scenarios: true
            }
        }, function(err, doc) {
            if (err) return reject(err)
            if (_.isNull(doc)) { return reject(new errors.InfinityNotFoundError(test_doc.name)) }
            resolve(doc)
        });
    })
}

var insert = function(test_doc) {
    return new Promise(function(resolve, reject) {
        Test.find({ name: test_doc.name }, function(err, doc) {
            if (err) { return reject(err) }
            if (_.size(doc) == 0) {
                var new_test = new Test(test_doc)
                new_test
                    .save()
                    .then((rec) => { resolve(rec) })
                    .catch((err) => {
                        return reject(new errors.InfinityInvalidFormatError(JSON.stringify(err.errors), "Test"))
                    });
            } else {
                reject(new errors.InfinityKeyExistError(doc[0]._id))
            }

        })
    });
}


var del = function(id) {
    return new Promise(function(resolve, reject) {
        Test.findByIdAndRemove(id, function(err, res) {
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