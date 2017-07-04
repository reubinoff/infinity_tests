var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var random = require('randomstring')
chai.use(chaiHttp);


let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Test = mongoose.model('Test');
var Scenario = mongoose.model('Scenario');
var Step = mongoose.model('Step');
var Execution = mongoose.model('Execution');
var Core = mongoose.model('Core');
var Account = mongoose.model('Account');



describe('Execution', () => {
    beforeEach((done) => { //Before each execution we empty the database
        Core.remove({}, (err) => {
            Execution.remove({}, (err) => {
                Test.remove({}, (err) => {
                    Account.remove({}, (err) => {
                        Scenario.remove({}, (err) => {
                            Step.remove({}, (err) => {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST execution', () => {
        it('it should not POST a execution without entry_env field', (done) => {
            generate_execution_1((exe) => {
                exe.entry_env = ""
                chai.request(server)
                    .post('/api/executions')
                    .send(exe)
                    .end((err, res) => {
                        console.log(err);
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error')
                        res.body.should.have.property('code').eql(30);
                        done();
                    });
            })
        });

        it('it should POST a execution ', (done) => {
            generate_execution_1((exe) => {
                chai.request(server)
                    .post('/api/executions')
                    .send(exe)
                    .end((err, res) => {
                        if (err) { console.log(err); }
                        res.should.have.status(200);
                        res.body.should.have.property('entry_env');
                        res.body.should.have.property('cores')
                        res.body.cores.length.should.be.eql(2)
                        done();
                    });
            })
        })

        it('it should Not POST a execution with invalid test id ', (done) => {
            generate_execution_1((exe) => {
                exe.test = ""
                chai.request(server)
                    .post('/api/executions')
                    .send(exe)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error')
                        res.body.should.have.property('code').eql(30);
                        done();
                    });
            })
        });
    });
    /*
     * Test the /GET route
     */
    describe('/GET test', () => {
        it('it should GET all the executions', (done) => {
            generate_execution_1((exe) => {
                let execution = new Execution(exe)
                execution.save((err, _exe) => {
                    chai.request(server)
                        .get('/api/executions')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(1);
                            done();
                        });
                });
            });
        });
        it('it should GET a execution by the given id', (done) => {
            generate_execution_1((exe) => {
                let execution = new Execution(exe)
                execution.save((err, _exe) => {
                    chai.request(server)
                        .get('/api/executions/' + _exe.id)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(_exe.id);
                            res.body.should.have.property('cores')
                            done();

                        });
                });
            });

        });
    });
    /*
     * Test the /PUT route
     */
    describe('/PUT/:id execution', () => {
        it('it should PUT a execution by the given id and update existing record', (done) => {
            generate_execution_1((exe) => {
                let execution = new Execution(exe)
                execution.save((err, _exe) => {
                    generate_execution_1((exe_2) => {
                        exe_2.name = _exe.name
                        chai.request(server)
                            .put('/api/executions/' + _exe.id)
                            .send(exe_2)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('_id');
                                res.body.should.have.property('name').eql(exe_2.name);
                                res.body.should.have.property('cores')
                                res.body.cores.should.be.a('array');
                                res.body.cores.length.should.be.eql(2)
                                done();
                            });
                    });
                });
            });
        });
    });
    /*
     * Test the /DELETE route
     */
    describe('/DELETE/:id execution', () => {
        it('it should DELETE a execution given the id', (done) => {
            generate_execution_1((exe) => {
                let execution = new Execution(exe)
                execution.save((err, _exe) => {
                    chai.request(server)
                        .delete('/api/executions/' + _exe.id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(_exe.id);
                            done();
                        })
                })
            })
        });

    });
});

function generate_step() {
    return {
        "name": random.generate({
            charset: 'abc'
        }),
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

function generate_execution_1(next) {
    create_test(function(test) {
        create_account((account_id) => {
            create_core((core_id) => {
                create_core((core_id_2) => {
                    next({
                        "name": random.generate(),
                        "date": Date.now(),
                        "account": account_id,
                        "cores": [core_id, core_id_2],
                        "to_check_env": true,
                        "test": test._id,
                        "entry_env": core_id
                    })
                })
            })
        })
    })
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
        if (err) { console.log(err); }
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
        if (err) { console.log(err); }
        next(_account._id)
    })
}