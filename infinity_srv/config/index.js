const config = {}

config.session = {
    secret: "moshe reubinoff"
}

config.office = {
    password: "07Uh3NgDTQxPZ47EPH8MAJr",
    app_name: "infinity-test"
}

config.server = {
    port : 8000
}
config.mongo = {
    mongo_uri_test: "mongodb://localhost:27017/infinity_test",
    mongo_uri_debug: "mongodb://localhost:27017/infinity_debug",
    mongo_uri_prod: "mongodb://localhost:27017/infinity"
}
module.exports = config