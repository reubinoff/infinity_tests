var winston = require('winston');
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var _ = require('lodash')
const errors = require('../lobby/error')


var get_users = function (token) {
    return new Promise(function (resolve, reject) {
        Account.find().sort({ username: 1 })
            .then((user) => {
                resolve(user);
            })
            .catch((err) => { reject(err) });
    });
}


var get_user_by_id = function (token) {
    return new Promise(function (resolve, reject) {
        Account.findById(token)
            .then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err)
            });
    });
}


var get_user_by_val = function (email, username, cb) {
    return new Promise(function (resolve, reject) {
        Account.
            findOne()
            .or([{ username: username }, { email: email }])
            .exec()
            .then((user) => {
                if (!user) {
                    return reject(new errors.InfinityUserFoundError())
                }
                resolve(user);
            })
            .catch((err) => {
                reject(err)
            });

    })
}

module.exports.get_user_by_id = get_user_by_id
module.exports.get_user_by_val = get_user_by_val
module.exports.get_users = get_users

