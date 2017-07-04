var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
const config = require("../../config")
var idvalidator = require('mongoose-id-validator');
var schemas = require('./schemas')

function Init() {

    schemas.Scenario.plugin(idvalidator, { allowDuplicates: true });
    schemas.Test.plugin(idvalidator, { allowDuplicates: true });
    schemas.Execution.plugin(idvalidator);
    schemas.Result.plugin(idvalidator, { allowDuplicates: true });


    schemas.Account.plugin(passportLocalMongoose);

    mongoose.model('Step', schemas.Step);
    mongoose.model('Scenario', schemas.Scenario);
    mongoose.model('Test', schemas.Test);
    mongoose.model('Core', schemas.Core);
    mongoose.model('Account', schemas.Account);
    mongoose.model('Execution', schemas.Execution);
    mongoose.model('Result', schemas.Result);



    var mongo_uri = ""
    if (process.env.NODE_ENV == 'test') {
        mongo_uri = config.mongo.mongo_uri_test
    } else if (process.env.NODE_ENV == 'debug') {
        mongo_uri = config.mongo.mongo_uri_debug
    } else if (process.env.NODE_ENV == 'prod') {
        mongo_uri = config.mongo.mongo_uri_prod
    }
    mongoose.Promise = global.Promise;
    mongoose.connect(mongo_uri);

    return mongo_uri
}

module.exports = Init