var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);


let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Test = mongoose.model('Test');
var Scenario = mongoose.model('Scenario');
var Step = mongoose.model('Step');


describe('Test', () => {
    beforeEach((done) => { //Before each test we empty the database
        Test.remove({}, (err) => {
            Scenario.remove({}, (err) => {
                Step.remove({}, (err) => {
                    done();
                });
            });
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST test', () => {
        it('it should not POST a test without name field', (done) => {
            let step = new Step(generate_step_1())
            step.save((err, _step) => {
                let scenario_1 = new Scenario(generate_scneario_1(_step._id))
                scenario_1.save((err, _scenario) => {
                    let test = generate_test_1(_scenario._id)
                    test.name = ""
                    chai.request(server)
                        .post('/api/tests')
                        .send(test)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.should.have.property('error')
                            res.body.should.have.property('code').eql(30);
                            done();
                        });
                })
            });
        })

        it('it should POST a test ', (done) => {
            let step = new Step(generate_step_2())
            step.save((err, _step) => {
                if (err) { console.log(err); }
                let scenario_1 = new Scenario(generate_scneario_1(_step._id))
                scenario_1.save((err, _scenario) => {
                    let test = generate_test_1(_scenario._id)
                    chai.request(server)
                        .post('/api/tests')
                        .send(test)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('scenarios')
                            res.body.scenarios.length.should.be.eql(2)
                            done();
                        });
                })
            });
        })
        it('it should Not POST a test with invalid scenario id ', (done) => {

            let test = generate_test_1("58dd45e11b801b346e8c29ec")
            chai.request(server)
                .post('/api/tests')
                .send(test)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error')
                    res.body.should.have.property('code').eql(30);
                    done();
                });
        });
    });
    /*
     * Test the /GET route
     */
    describe('/GET test', () => {
        it('it should GET all the tests', (done) => {
            let step = new Step(generate_step_2())
            step.save((err, _step) => {
                if (err) { console.log(err); }
                let scenario_1 = new Scenario(generate_scneario_1(_step._id))
                scenario_1.save((err, _scenario) => {
                    let test = new Test(generate_test_1(_scenario._id))
                    test.save((err, _test) => {
                        chai.request(server)
                            .get('/api/tests')
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                res.body.length.should.be.eql(1);
                                done();
                            });
                    });
                });
            });
        });
        it('it should GET a test by the given id', (done) => {
            let step = new Step(generate_step_2())
            step.save((err, _step) => {
                if (err) { console.log(err); }
                let scenario_1 = new Scenario(generate_scneario_1(_step._id))
                scenario_1.save((err, _scenario) => {
                    let test = new Test(generate_test_1(_scenario._id))
                    test.save((err, _test) => {
                        chai.request(server)
                            .get('/api/tests/' + _test.id)
                            .send()
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('_id').eql(_test.id);
                                res.body.should.have.property('scenarios')
                                res.body.scenarios.length.should.be.eql(2)
                                done();

                            });
                    });
                });
            });

        });
    });
    /*
     * Test the /PUT route
     */
    describe('/PUT/:id test', () => {
        it('it should PUT a test by the given id and update existing record', (done) => {
            let step = new Step(generate_step_2())
            step.save((err, _step) => {
                if (err) { console.log(err); }
                let scenario_1 = new Scenario(generate_scneario_1(_step._id))
                scenario_1.save((err, _scenario) => {
                    let test = new Test(generate_test_1(_scenario._id))
                    test.save((err, _test) => {
                        let test_2 = generate_test_2(_scenario._id)
                        test_2.name = test.name
                        chai.request(server)
                            .put('/api/tests/' + _test.id)
                            .send(test_2)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('_id');
                                res.body.should.have.property('name').eql(test.name);
                                res.body.should.have.property('scenarios')
                                res.body.scenarios.should.be.a('array');
                                res.body.scenarios.length.should.be.eql(3)
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
    describe('/DELETE/:id test', () => {
        it('it should DELETE a test given the id', (done) => {
            let step = new Step(generate_step_2())
            step.save((err, _step) => {
                if (err) { console.log(err); }
                let scenario_1 = new Scenario(generate_scneario_1(_step._id))
                scenario_1.save((err, _scenario) => {
                    let test = new Test(generate_test_1(_scenario._id))
                    test.save((err, _test) => {
                        chai.request(server)
                            .delete('/api/tests/' + _test.id)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('_id').eql(_test.id);
                                done();
                            })
                    })
                })
            });

        });
    });


});

function generate_step_1() {
    return {
        "name": "step_name",
        "description": "descripbr soth",
        "args": [{
            "name": "arg1",
            "description": "arg1 des",
            "is_array": false
        }]
    }
}

function generate_step_2() {
    return {
        "name": "step_name_3",
        "description": "descripbr soth",
        "args": [{
            "name": "arg1",
            "description": "arg1 des",
            "is_array": false
        }]
    }
}

function generate_scneario_1(step_id) {
    return {
        "name": "scneario A",
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

function generate_scneario_2(step_id) {
    return {
        "name": "scneario B",
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

function generate_test_1(scneario_id) {
    return {
        "name": "test_A",
        "description": "des test A ",
        "flow": {
            "loop": 3
        },
        "scenarios": [scneario_id, scneario_id]
    }
}

function generate_test_2(scneario_id) {
    return {
        "name": "test_A",
        "description": "des test A ",
        "flow": {
            "loop": 3
        },
        "scenarios": [scneario_id, scneario_id, scneario_id]
    }
}