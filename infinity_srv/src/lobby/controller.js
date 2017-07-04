var logger = require('winston');
const _ = require('lodash');
const errors = require('./error')


function getAll(req, res, next) {
    req.db_component.getAll()
        .then((records) => {
            res.json(records);
            next()
        }, (err) => { return next(err) })
        .catch(next)

}


function getById(req, res, next) {
    req.db_component.getById(req.params.id)
        .then((record) => {
            if (_.isNull(record)) { return next(new errors.InfinityNotFoundError(req.params.id)) }
            res.json(record);
            next()
        }, (err) => { return next(err) })
        .catch(next)
}

function insert(req, res, next) {
    req.db_component.insert(req.body)
        .then((records) => {
            res.json(records);
            res.locals.insert = records
            next()
        }, (err) => { return next(err) })
        .catch(next)
}



function del(req, res, next) {
    req.db_component.delete(req.params.id)
        .then((records) => {
            res.json(records);
            next()
        }, (err) => { return next(err) })
        .catch(next)

}

function update(req, res, next) {
    req.db_component.update_by_id(req.params.id, req.body)
        .then((records) => {
            res.json(records);
            next()
        }, (err) => { return next(err) })
        .catch(next)


}



module.exports.getById = getById;
module.exports.getAll = getAll;
module.exports.insert = insert;
module.exports.update = update;
module.exports.delete = del;