var winston = require('winston');
var mongoose = require('mongoose');
var Core = mongoose.model('Core');
var _ = require('lodash')
const errors = require('../lobby/error')


var getAll = function() {
    return new Promise(function(resolve, reject) {
        Core.find().sort({ name: 1 })
            .then((cores) => {
                resolve(cores.sort('name'));
            })
            .catch((err) => { reject(err) });
    });
}

var getById = function(id) {
    return new Promise(function(resolve, reject) {
        Core.findOne({ _id: id })
            .then((core) => {
                resolve(core);
            })
            .catch((err) => { reject(err) });
    });
}


var update_by_id = function(id, core_doc) {
    return new Promise(function(resolve, reject) {
        res = Core.findOneAndUpdate({ _id: id }, { $set: core_doc }, {
            new: true,
            fields: {
                name: true,
                topology_name: true,
                host: true,
                user: true,
                password: true,
                port: true
            }
        }, function(err, doc) {
            if (err) return reject(err)
            if (_.isNull(doc)) { return reject(new errors.InfinityNotFoundError(core_doc.name)) }
            resolve(doc)
        });
    })
}


var insert = function(core_doc) {
    return new Promise(function(resolve, reject) {
        Core.find({ name: core_doc.name, topology_name: core_doc.topology_name }, function(err, doc) {
            if (err) { return reject(err) }
            if (_.size(doc) == 0) {
                var new_core = new Core(core_doc)
                new_core.save()
                    .then((rec) => { resolve(rec) })
                    .catch((err) => { return reject(new errors.InfinityInvalidFormatError(JSON.stringify(new_core), "Core")) });
            } else {
                reject(new errors.InfinityKeyExistError(doc[0]._id))
            }

        })
    });
}


var del = function(id) {
    return new Promise(function(resolve, reject) {
        Core.findByIdAndRemove(id, function(err, res) {
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