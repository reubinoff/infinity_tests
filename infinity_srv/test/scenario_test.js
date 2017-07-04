var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);


let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Scenario = mongoose.model('Scenario');
var Step = mongoose.model('Step');


describe('scenario', () => {
    beforeEach((done) => { //Before each test we empty the database
        Scenario.remove({}, (err) => {
            Step.remove({}, (err) => {
                done();
            });
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST scenario', () => {
        it('it should not POST a scenario without name field', (done) => {
            let step_1 = new Step(get_fedault_step_1());

            step_1.save((err, _step_1) => {
                let scenario = {
                    "description": "first 45",
                    "flow": {
                        "loop": 1
                    },
                    "steps": [{
                        "step": step_1._id,
                        "flow": {
                            "loop": 2
                        }
                    }]
                }
                chai.request(server)
                    .post('/api/scenarios')
                    .send(scenario)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error')
                        res.body.should.have.property('code').eql(30);
                        done();
                    });
            })
        })

        it('it should POST a scenario ', (done) => {
            let step_1 = new Step(get_fedault_step_1());
            step_1.save((err, _step_1) => {
                let scenario = {
                    "name": "Scenario A",
                    "description": "first 45",
                    "flow": {
                        "loop": 1
                    },
                    "steps": [{
                        "step": step_1._id,
                        "flow": {
                            "loop": 2
                        }
                    }]
                }
                chai.request(server)
                    .post('/api/scenarios')
                    .send(scenario)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('name').eql(scenario.name);
                        done();
                    });
            });
        })
        it('it should Not POST a scenario with invalid Step id ', (done) => {


            let scenario = {
                "name": "Scenario A",
                "description": "first 45",
                "flow": {
                    "loop": 1
                },
                "steps": [{
                    "step": "58dd45e11b801b346e8c29ec",
                    "flow": {
                        "loop": 2
                    }
                }]
            }
            chai.request(server)
                .post('/api/scenarios')
                .send(scenario)
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
    describe('/GET scenario', () => {
        it('it should GET all the scenarios', (done) => {
            chai.request(server)
                .get('/api/scenarios')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
        it('it should GET a scenario by the given id', (done) => {
            let step_1 = new Step(get_fedault_step_1());

            step_1.save((err, _step_1) => {
                let scenario = new Scenario({
                    "name": "Scenario A",
                    "description": "first 45",
                    "flow": {
                        "loop": 1
                    },
                    "steps": [{
                        "step": step_1._id,
                        "flow": {
                            "loop": 2
                        }
                    }]
                })
                scenario.save((err, _scenario) => {
                    chai.request(server)
                        .get('/api/scenarios/' + _scenario.id)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(_scenario.id);
                            done();
                        });
                });
            });

        });
    });
    /*
     * Test the /PUT route
     */
    describe('/PUT/:id scenario', () => {
        it('it should PUT a scenario by the given id and update existing record', (done) => {
            let step_1 = new Step(get_fedault_step_1());
            let step_2 = new Step(get_fedault_step_2());

            step_1.save((err, _step_1) => {
                step_2.save((err, _step_1) => {
                    let scenario = new Scenario({
                        "name": "Scenario A",
                        "description": "first 45",
                        "flow": {
                            "loop": 1
                        },
                        "steps": [{
                            "step": step_1._id,
                            "flow": {
                                "loop": 2
                            }
                        }]
                    })
                    scenario.save((err, _scenario) => {
                        let scenario_2 = {
                            "name": _scenario.name,
                            "description": "first 46",
                            "flow": {
                                "loop": 2
                            },
                            "steps": [{
                                "step": step_1._id,
                                "flow": {
                                    "loop": 3
                                }
                            }, {
                                "step": step_2._id,
                                "flow": {
                                    "loop": 2
                                }
                            }]
                        }
                        chai.request(server)
                            .put('/api/scenarios/' + _scenario.id)
                            .send(scenario_2)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('_id');
                                res.body.should.have.property('name').eql(scenario.name);
                                res.body.should.have.property('steps')
                                res.body.steps.should.be.a('array');
                                res.body.steps.length.should.be.eql(2)
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
    describe('/DELETE/:id scenario', () => {
        it('it should DELETE a scenario given the id', (done) => {
            let step_1 = new Step(get_fedault_step_1());
            step_1.save((err, _step) => {
                let scenario = new Scenario({
                    "name": "Scenario A",
                    "description": "first 45",
                    "flow": {
                        "loop": 1
                    },
                    "steps": [{
                        "step": _step._id,
                        "flow": {
                            "loop": 2
                        }
                    }]
                })
                scenario.save((err, _scenario) => {
                    chai.request(server)
                        .delete('/api/scenarios/' + _scenario.id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(_scenario.id);
                            done();
                        })
                })
            });

        });
    });


});


function get_fedault_step_1() {
    return {
        "name": "step_name1",
        "description": "descripbr soth",
        "args": [{
            "name": "arg1",
            "description": "arg1 des",
            "is_array": false
        }]
    }
}


function get_fedault_step_2() {
    return {
        "name": "step_name2",
        "description": "descripbr soth",
        "args": [{
            "name": "arg1",
            "description": "arg1 des",
            "is_array": false
        }, {
            "name": "arg2",
            "description": "arg1 des",
            "is_array": false
        }]
    }
}