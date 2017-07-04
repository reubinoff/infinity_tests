const logger = require('winston')
const execution_preparation = require('./execution_preparation')
const _ = require('lodash')
const errors = require('../lobby/error')

function handle_new_execution(execution_id) {
    logger.debug("Start handling new execution: ", execution_id)

    execution_preparation.generate_config_file(execution_id)
        .then((config_file) => {
                logger.info("Config file for test: ", execution_id, " parsed! invoking Test.")
                invoke_test(config_file)
            },
            (err) => { logger.error('Failed to execute test due to: ', err) }
        )
        .catch(
            (err) => { logger.exception('Failed to execute test due to: ', err) }
        )

}

function invoke_test(config_file) {

}


module.exports.handle_new_execution = handle_new_execution