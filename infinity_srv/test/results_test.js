var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var random = require('randomstring')
chai.use(chaiHttp);


let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Result = mongoose.model('Result');
var Test = mongoose.model('Test');
var Scenario = mongoose.model('Scenario');
var Step = mongoose.model('Step');
var Execution = mongoose.model('Execution');
var Core = mongoose.model('Core');
var Account = mongoose.model('Account');

describe('Result', () => {
    beforeEach((done) => { //Before each test we empty the database
        Core.remove({}, (err) => {
            Result.remove({}, (err) => {
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

    });
    /*
     * Test the /POST route
     */
    describe('/POST Result', () => {
        it('it should not POST a Result without result field', (done) => {
            gen_result((data) => {
                data.execution = ""
                chai.request(server)
                    .post('/api/results')
                    .send(data)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error')
                        res.body.should.have.property('code').eql(30);
                        done();
                    });
            })
        });

        it('it should POST a Result ', (done) => {
            gen_result((data) => {
                data.result = undefined
                chai.request(server)
                    .post('/api/results')
                    .send(data)
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('result').eql(false);
                        done();
                    });
            })
        });

        it('it should not POST a duplicate results  ', (done) => {
            gen_result((data) => {
                let res = new Result(data)
                res.save((err, doc) => {
                    data.result = undefined
                    chai.request(server)
                        .post('/api/results')
                        .send(data)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.should.have.property('error')
                            res.body.should.have.property('code').eql(30);
                            done();
                        });
                })
            })
        });


    });
    /*
     * Test the /GET route
     */
    describe('/GET Result', () => {
        it('it should GET all the Results', (done) => {
            chai.request(server)
                .get('/api/results')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
        it('it should GET a Result by the given id', (done) => {
            gen_result((data) => {
                let res = new Result(data)
                res.save((err, doc) => {
                    data.result = undefined
                    chai.request(server)
                        .get('/api/results/' + doc.id)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(doc.id);
                            done();
                        });
                });
            });


        });
    });
    /*
     * Test the /PUT route
     */
    describe('/PUT/:id result', () => {
        it('it should PUT a Result by the given id', (done) => {
            gen_result((data) => {
                let res = new Result(data)
                res.save((err, doc) => {
                    data.result = undefined
                    chai.request(server)
                        .put('/api/results/' + doc._id)
                        .send(data)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            done();
                        });
                });
            });
        });
    });
    /*
     * Test the /DELETE route
     */
    describe('/DELETE/:id Result', () => {
        it('it should DELETE a Result given the id', (done) => {
            gen_result((data) => {
                let res = new Result(data)
                res.save((err, doc) => {
                    chai.request(server)
                        .delete('/api/results/' + doc.id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(doc.id);
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

function generate_execution(next) {
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

function gen_result(next) {
    generate_execution((data) => {
        let execution = new Execution(data)
        execution.save((err, data) => {
            next({
                result: true,
                execution: data._id
            })
        })
    })

}