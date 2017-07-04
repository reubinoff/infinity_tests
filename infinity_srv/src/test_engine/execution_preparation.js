const logger = require('winston')
const execution_db = require('../db/executions')
const scenarioes_db = require('../db/scenarios')
const error = require('../lobby/error')
const _ = require('lodash')
const fs = require('fs')

function generate_config_file(execution_id) {
    return new Promise(function(resolve, reject) {
        read_by_id(execution_id, execution_db, (err, execution_handler) => {
            if (_.isUndefined(execution_handler) || _.isNull(execution_handler) || err) {
                logger.error("execution Termianted for id: ", execution_id)
                reject(new error.InfinityKeyExistError(execution_id))
            }
            logger.info("generate config file for execution: ", execution_handler._id, ", for test name: ", execution_handler.test.name)

            parse_test(execution_handler)
                .then((config_file) => {
                    fs.writeFile('/home/mreubino/Downloads/config.json', JSON.stringify(config_file))
                    return resolve(config_file)
                }, (err) => { return reject(err) })
                .catch((err) => {
                    return reject(err)
                })
        })
    })
}

function parse_test(execution_handler, on_parse_done) {
    // Test params
    var test_template = {
        id: "",
        test: {
            name: "",
            entry_env: "",
            to_check_env: true,
            flow: {},
            scenarios: [{}]
        },
        env: {},
        user: {}
    }
    return new Promise(function(resolve, reject) {
        test_template.id = execution_handler._id
        test_template.test.name = execution_handler.name
        test_template.test.entry_env = execution_handler.entry_env.name
        test_template.test.to_check_env = execution_handler.to_check_env
        test_template.test.flow = execution_handler.test.flow


        test_template.test.scenarios = execution_handler.test.scenarios.map(parse_scenario)

        if (_.isEmpty(test_template.test.scenarios)) {
            return reject("failed to generate scenarios")
        }

        execution_handler.cores.forEach(function(item) {
            test_template.env[item.name] = {
                host: item.host,
                name: item.topology_name,
                port: item.port,
                password: item.password,
                user: item.user
            }
        }, this);

        test_template.user = {
            name: execution_handler.user.username,
            email: execution_handler.user.email
        }

        resolve(test_template)
    })
}

function parse_scenario(scenario) {
    var new_scenario = {
        name: "",
        flow: {},
        steps: [{}]
    }
    new_scenario.name = scenario.name
    new_scenario.flow = scenario.flow
    new_scenario.steps = scenario.steps.map(parse_step)

    return new_scenario

}


function parse_step(step) {
    step_model = step.step
    var new_step = {
        name: "",
        args: {},
        flow: {}
    }
    new_step.name = step_model.name
    new_step.flow = step.flow

    if (!_.isUndefined(step.expect_result)) {
        new_step.expect_result = step.expect_result
    }
    args = step.args.reduce(function(args_item, item) {
        if (_.isArray(item.val) && item.val.length > 1) {
            args_item[item.arg_name] = item.val
        } else {
            args_item[item.arg_name] = item.val[0]
        }
        return args_item
    }, {})
    new_step.args = args

    return new_step
}

function parse_args(arg) {
    var new_arg = {}
    if (_.isArray(arg.val) && arg.val.length > 1) {
        new_arg[arg.arg_name] = arg.val
    } else {
        new_arg[arg.arg_name] = arg.val[0]
    }
    return new_arg
}

function read_by_id(_id, from, next) {
    from.getById(_id)
        .then((record) => {
            next(undefined, record)
        })
        .catch((err) => {
            logger.error('Failed to retrieve ', from.model.modelName, ' by Id: ', _id)
            next(err)
        })
}



module.exports.generate_config_file = generate_config_file