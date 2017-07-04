var express = require('express')
var app = express()
var connection_string = require('./src/db/init')();
var logger = require('winston')
var bodyParser = require('body-parser');
const ControllerRouters = require('./src/lobby/routers')
const LoggingRouters = require('./src/lobby/logging')
const AuthRouters = require('./src/lobby/authenication')
const FinalRouters = require('./src/lobby/final')
const Listener = require('./src/test_engine')
var morgan = require('morgan')
const config = require('./config')
var mongoose = require('mongoose');
var passport = require('passport');
var Session = require('express-session')
const MongoStore = require('connect-mongo')(Session);


const pages_path = __dirname + "/www";

if (process.env.NODE_ENV == 'test') {
    logger.remove(logger.transports.Console);
} else {
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

logger.add(logger.transports.File, {filename: "/tmp/infinity_srv.log"})

logger.log(express.static(pages_path))
logger.info('Using mongo connection: ', connection_string)

app.use(express.static(pages_path));

app.use(Session({
    secret: 'foo',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain)

//routers
app.use('/', LoggingRouters())
app.use('/auth', AuthRouters(app))
app.use('/api', ControllerRouters(passport));

app.use(FinalRouters)

app.get('/test', function (req, res) {
    res.sendFile(pages_path + "/test.html")
})

app.listen(config.server.port, function () {
    console.log('Example app listening on port ', config.server.port)
})

module.exports = app;