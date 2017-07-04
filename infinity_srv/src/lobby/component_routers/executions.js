const EventEmitter = require('events');
const logger = require('winston')
const _ = require('lodash')
const infinity_event = require("../../infinity_events")



function parse_name(req, res, next) {
    if (process.env.NODE_ENV != 'test') {
        const name = req.user.username
        const date = Date.now().toFixed()
        req.body.name = name + "_" + date
    }
    next()
}

function execute_test(req, res, next) {
    const execution = res.locals.insert
    if (_.isNull(execution) || _.isUndefined(execution)) {
        logger.error("Execution Error from user: ", req.user.username)
        next()
    }
    execution_id = execution._id.toHexString()
    logger.info("new execution received from User: ", req.user.username, ", execution id:", execution_id)

    // Execute a Test!!
    infinity_event.emitter.emit(infinity_event.NEW_EXECUTION, execution_id)
    next()
}

module.exports.parse_name = parse_name
module.exports.execute_test = execute_test