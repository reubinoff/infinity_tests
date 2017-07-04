var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);


let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Step = mongoose.model('Step');


describe('Step', () => {
    beforeEach((done) => { //Before each test we empty the database
        Step.remove({}, (err) => {
            done();
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST Step', () => {
        it('it should not POST a Step without name field', (done) => {
            let step = {
                "description": "descripbr soth",
                "args": [{
                    "name": "arg1",
                    "description": "arg1 des",
                    "is_array": false
                }]
            }
            chai.request(server)
                .post('/api/steps')
                .send(step)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error')
                    res.body.should.have.property('code').eql(30);
                    done();
                });
        });

        it('it should POST a Step ', (done) => {
            let step = {
                "name": "step_name",
                "description": "descripbr soth",
                "args": [{
                    "name": "arg1",
                    "description": "arg1 des",
                    "is_array": false
                }]
            }
            chai.request(server)
                .post('/api/steps')
                .send(step)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name').eql(step.name);
                    done();
                });
        });


    });
    /*
     * Test the /GET route
     */
    describe('/GET Step', () => {
        it('it should GET all the Steps', (done) => {
            chai.request(server)
                .get('/api/steps')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
        it('it should GET a Step by the given id', (done) => {
            let step = new Step({
                "name": "step_name",
                "description": "descripbr soth",
                "args": [{
                    "name": "arg1",
                    "description": "arg1 des",
                    "is_array": false
                }]
            })
            step.save((err, _step) => {
                chai.request(server)
                    .get('/api/steps/' + _step.id)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id').eql(_step.id);
                        done();
                    });
            });

        });
    });
    /*
     * Test the /PUT route
     */
    describe('/PUT/:id step', () => {
        it('it should PUT a step by the given id and update existing record', (done) => {
            let step_1 = new Step({
                "name": "step_name",
                "description": "descripbr soth",
                "args": [{
                    "name": "arg1",
                    "description": "arg1 des",
                    "is_array": false
                }]
            });
            let step_2 = {
                "name": "step_name",
                "description": "new_step",
                "args": [{
                    "name": "arg1",
                    "description": "arg1 des",
                    "is_array": false
                }, {
                    "name": "arg2",
                    "description": "arg2 des",
                    "is_array": false
                }]
            }
            step_1.save((err, _step_1) => {
                chai.request(server)
                    .put('/api/steps/' + _step_1.id)
                    .send(step_2)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('description').eql(step_2.description);
                        res.body.should.have.property('args')
                        res.body.args.should.be.a('array');
                        res.body.args.length.should.be.eql(2)
                        done();
                    });
            });
        });
    });
    /*
     * Test the /DELETE route
     */
    describe('/DELETE/:id Step', () => {
        it('it should DELETE a Step given the id', (done) => {
            let step_1 = new Step({
                "name": "step_name",
                "description": "descripbr soth",
                "args": [{
                    "name": "arg1",
                    "description": "arg1 des",
                    "is_array": false
                }]
            });
            step_1.save((err, _step_1) => {
                chai.request(server)
                    .delete('/api/steps/' + _step_1.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id').eql(_step_1.id);
                        done();
                    })
            })

        });
    });


});