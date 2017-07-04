var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose');
const _ = require('lodash');
const error = require('./error')
var logger = require('winston');
var Account = mongoose.model('Account');
var account_db = require("../db/account")
var BearerStartegy = require('passport-http-bearer').Strategy;
function CreateRouter(app) {
    var router = require('express').Router()

    // Configuration



    passport.use(new LocalStrategy(Account.authenticate()));
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());

    passport.use(new BearerStartegy({}, function (token, next) {
        account_db
            .get_user_by_id(token)
            .then((user) => {
                if (!user) {
                    return next(new error.InfinityUserFoundError(), false)
                }
                return next(null, user)
            }, (err) => {
                return next(new error.InfinityUserFoundError(), false)
            })
    }));

    // Routers
    router.get('/users', function (req, res, next) {
        const email = req.query.email
        const username = req.query.username

        if (_.isUndefined(email) && _.isUndefined(username)) {
            account_db.
                get_users()
                .then((records) => {
                    res.json(records);
                    next()
                }, (err) => { return next(err) })
                .catch(next)
        } else {
            account_db
                .get_user_by_val(email, username)
                .then((user) => {
                    if (!user) {
                        return next(new error.InfinityUserFoundError(), false)
                    }
                    return res
                        .status(200)
                        .json({ id: user._id.toHexString(), user: user })
                }, (err) => {
                    return next(err, false)
                })
        }
    })
    router.get('/users/:id', function (req, res, next) {
        if (_.isEmpty(req.params.id) || _.isUndefined(req.params.id) || _.isNull(req.params.id)) {
            return next(err, false)
        }
        account_db
            .get_user_by_id(req.params.id)
            .then((user) => {
                if (!user) {
                    return next(new error.InfinityUserFoundError(), false)
                }
                return res
                    .status(200)
                    .json({ id: user._id.toHexString(), user: user })
            }, (err) => {
                return next(err, false)
            })
    })

    router.post('/register', function (req, res, next) {
        logger.log('registering user');
        check_empty_body(req, res, next)
        if (_.isUndefined(req.body.username) || _.isUndefined(req.body.password)) {
            return next(new error.InfinityRegistrationError(req.body.username, undefined));
        }
        Account
            .register(new Account({ username: req.body.username, email: req.body.email }), req.body.password, function (err, doc) {
                if (err) {
                    return next(new error.InfinityRegistrationError(req.body.username, err));
                }

                logger.log('user registered!');

                return res
                    .status(200)
                    .json({ registration_status: "OK", id: doc._id.toHexString(), user: doc })
            });
    });

    router.post('/login', passport.authenticate('local', { failureMessage: "moshe" }), function (req, res) {
        logger.info('User: %s >> logged in', req.user.username);
        return res
            .status(200)
            .json({ registration_status: "OK", id: req.user._id.toHexString(), user: req.user })
    })

    router.patch('/logout', function (req, res, next) {
        req.logout();
        return res
            .status(200)
            .json({ registration_status: "OK" })
    });

    return router
}

function check_empty_body(req, res, next) {
    if (_.isEmpty(req.body)) {
        return next(new errors.InfinityEmptyBodyError())
    }
}
module.exports = CreateRouter