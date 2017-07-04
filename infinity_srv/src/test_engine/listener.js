const infinity_events = require('../infinity_events')
const test_controller = require('./test_controller')
const logger = require('winston')

infinity_events.emitter.on(infinity_events.NEW_EXECUTION, (execution_id) => {
    logger.debug('event::NEW_EXECUTION >> ', execution_id);

    test_controller.handle_new_execution(execution_id)
});