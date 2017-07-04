var db = require('../db/hanlers');

var express = require('express');
var logger = require('winston')
var errors = require('./error')
var controller = require('./controller')
const component_routers = require('./component_routers')
const config = require("../../config")

const _ = require('lodash');
var CreateRouters = function(passport) {

    db_controller = {
        steps: db.steps,
        cores: db.cores,
        scenarios: db.scenarios,
        tests: db.tests,
        executions: db.executions,
        results: db.results
    }


    var router = express.Router()


    // validation
    // router.use(loggedIn)
    
    router.use(passport.authenticate('bearer', { session: true }));


    router.use('/:component', validate_component)
    router.route('/:comp/:id')
        .post(gen_put)
    router.route('/:comp/')
        .put(gen_put)
        .delete(gen_del)


    // spesific components 
    router
        .post('/executions', component_routers.executions.parse_name)


    // controllers
    router.get('/:component', controller.getAll); ///scenarios/
    router.get('/:component/:id', controller.getById); ///steps/58729f3c34efe341ae684bde
    router.put('/:component/:id', controller.update); ///steps/58729f3c34efe341ae684bde
    router.post('/:component/', controller.insert); ///steps/
    router.delete('/:component/:id', controller.delete); // /steps/5872866831518b21b69dc58e 

    // post db
    router
        .post('/executions', component_routers.executions.execute_test)


    return router

}

function validate_component(req, res, next) {
    comp = req.params.component
    if (_.isEmpty(comp) ||
        !(comp in db_controller)) {
        return next(new errors.InfinityNotFoundError("PATH"))
    }
    req.db_component = db_controller[comp]
    next()
}

function gen_post(req, res, next) {
    check_empty_body(req, res, next)
    next()
}

function gen_put(req, res, next) {
    check_empty_body(req, res, next)
    check_id(req, res, next)
    next()
}

function gen_del(req, res, next) {
    check_id(req, res, next)
}

function check_id(req, res, next) {
    if (_.isEmpty(req.params.id)) {
        return next(new errors.InfinityNotFoundError(req.params.id))
    }
    next()
}

function check_empty_body(req, res, next) {
    if (_.isEmpty(req.body)) {
        return next(new errors.InfinityEmptyBodyError())
    }
    next()
}

function loggedIn(req, res, next) {
    if (!req.isAuthenticated() && process.env.NODE_ENV != 'test') {
        return next(new errors.InfinityUserFoundError(req.user))
    }

    if (process.env.NODE_ENV != 'test') {
        logger.info("User: ", req.user.username, ` >> req (${req.method}): `, req.originalUrl)
    }
    next()
}

module.exports = CreateRouters;