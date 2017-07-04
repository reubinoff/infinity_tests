var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var random = require('randomstring')
var sleep = require('sleep')
chai.use(chaiHttp);


let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Test = mongoose.model('Test');
var Scenario = mongoose.model('Scenario');
var Step = mongoose.model('Step');
var Execution = mongoose.model('Execution');
var Core = mongoose.model('Core');
var Account = mongoose.model('Account');



describe('Async Data', () => {



    describe('/GET/ generate 250 executions and Get them', () => {
        it('it should GET a executions', (done) => {
            total = 250
            Execution.remove({}, (err) => {
                generate_executions(total, () => {
                    chai.request(server)
                        .get('/api/executions/')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(total);
                            done();
                        })
                })
            });
        })
    });






});

function generate_step() {
    return {
        "name": random.generate(),
        "description": "descripbr soth",
        "args": [{
            "name": random.generate(),
            "description": random.generate(),
            "is_array": false
        }]
    }
}




function generate_scneario(step_id) {
    return {
        "name": random.generate(),
        "description": "first 46",
        "flow": {
            "loop": 2
        },
        "steps": [{
            "step": step_id,
            "flow": {
                "loop": 3
            }
        }, {
            "step": step_id,
            "flow": {
                "loop": 2
            }
        }]
    }
}


function generate_test(scneario_id) {
    return {
        "name": random.generate(),
        "description": "des test A ",
        "flow": {
            "loop": 3
        },
        "scenarios": [scneario_id, scneario_id]
    }
}

function generate_executions(total, next) {
    const a = (i, next) => {
        k = i
        create_test(function(test) {
            create_account((account_id) => {
                create_core((core_id) => {
                    create_core((core_id_2) => {
                        let execution = new Execution({
                            "name": random.generate(),
                            "date": Date.now(),
                            "account": account_id,
                            "cores": [core_id, core_id_2],
                            "to_check_env": true,
                            "test": test._id,
                            "entry_env": core_id
                        })

                        execution.save((err, doc) => {
                            if (i == total - 1) {
                                next()
                            }
                        })
                    })
                })
            })
        })
    }
    for (i = 0; i < total; i++) {
        a(i, next)
    }
}



function create_core(next) {
    let core = new Core({
        "name": random.generate(12),
        "topology_name": random.generate(12),
        "host": "10.40.2.108",
        "user": "ccap",
        "password": "passw",
        "port": 2022
    })
    core.save((err, _core) => {
        next(_core._id)
    })
}

function create_test(next) {
    let step = new Step(generate_step())
    step.save((err, _step) => {
        if (err) { console.log(err); }
        let scenario_1 = new Scenario(generate_scneario(_step._id))
        scenario_1.save((err, _scenario) => {
            if (err) { console.log(err); }
            let test = new Test(generate_test(_scenario._id))
            test.save((err, _test) => {
                if (err) { console.log(err); }
                next(_test)
            })
        })
    })
}

function create_account(next) {
    let account = new Account({
        username: random.generate(12),
        password: "password" + random.generate(12),
        email: "email" + random.generate(12)
    })
    account.save((err, _account) => {
        next(_account._id)
    })
}