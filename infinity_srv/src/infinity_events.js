const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

module.exports = {
    emitter: myEmitter,
    NEW_EXECUTION: "NEW_EXECUTION"
}