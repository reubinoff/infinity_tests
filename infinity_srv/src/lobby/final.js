var logger = require('winston');
const _ = require('lodash');
const errors = require('./error')
var express = require('express');



function finallizeError(err, req, res, next) {
    if (err instanceof errors.InfinityError) {
        if (err.status_code >= 500) {
            logger.error('%s\n', req.id, err);
        } else {
            logger.warn('%s\n', req.id, err);
        }

        return res
            .status(err.status_code)
            .json(err.json);
    } else {
        logger.error('%s\n', req.id, err);
        res.status(500).json({
            code: 10,
            error: 'unexpected error, please retry later',
        });
        next();
    }
}


module.exports = finallizeError;