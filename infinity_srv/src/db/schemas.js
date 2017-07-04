var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var Flow = {
    loop: { type: Number, required: true },
    enable: { type: Boolean, default: true },
    on_failure: { type: String, enum: ['none', 'print', 'stop', 'error'], default: 'print' }
}


const ExecutionStep = {
    step: { type: Schema.Types.ObjectId, ref: 'Step' },
    _id: false,
    flow: Flow,
    expect_result: { type: String },
    args: [{
        arg_name: { type: String, required: true },
        val: [Schema.Types.Mixed],
    }]
}

//Scheames

const Step = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    args: [{
        _id: false,
        name: { type: String, required: true },
        description: { type: String, required: true },
        is_array: { type: Boolean, default: false },
        arg_type: { type: String, enum: ["bool", "string", "int"] }
    }],
    return_val: [{
        _id: false,
        description: { type: String },
        val_type: { type: String, enum: ["bool", "string", "int"] }
    }]
});


const Scenario = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    flow: Flow,
    steps: [ExecutionStep]
})

const Test = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    flow: Flow,

    scenarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Scenario'
    }]
})

const Execution = new Schema({
    name: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now, required: true },
    user: { type: String, required: true },
    entry_env: {
        type: Schema.Types.ObjectId,
        ref: 'Core',
        required: true
    },
    cores: [{
        type: Schema.Types.ObjectId,
        ref: 'Core',
        required: true
    }],
    to_check_env: { type: Boolean, required: true },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    }
})

const Result = new Schema({
    execution: {
        type: Schema.Types.ObjectId,
        ref: 'Execution'
    },
    result: { type: Boolean, default: false }
})

const Core = new Schema({
    name: { type: String, required: true }, //cs010
    topology_name: { type: String, required: true, unique: true }, //hvs-166
    host: { type: String, required: true },
    user: { type: String, required: true },
    password: { type: String, required: true },
    port: { type: Number, required: true },
})

var Account = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    email: { type: String },

});


module.exports.Step = Step;
module.exports.Scenario = Scenario;
module.exports.Test = Test;
module.exports.Core = Core;
module.exports.Account = Account;
module.exports.Execution = Execution;
module.exports.Result = Result;