var util = require('util');
var winston = require('winston');
var express = require('express');

function CreateRouters() {
    var router = express.Router()



    // logging
    router.use(timestamp);

    return router

}

function timestamp(req, res, next) {
    if (process.env.NODE_ENV != 'test')
        winston.log(util.format('%s>> api: %s %s', Date.now(), JSON.stringify(req.body)));
    next()
}




module.exports = CreateRouters;