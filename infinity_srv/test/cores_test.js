var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);


let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Core = mongoose.model('Core');


describe('core', () => {
    beforeEach((done) => { //Before each test we empty the database
        Core.remove({}, (err) => {
            done();
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST test', () => {
        it('it should not POST a core without name field', (done) => {
            let core = {
                "topology_name": "hvss-16s6",
                "host": "10.40.2.108",
                "user": "ccap",
                "password": "passw",
                "port": 2022
            }
            chai.request(server)
                .post('/api/cores')
                .send(core)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error')
                    res.body.should.have.property('code').eql(30);
                    done();
                });
        });

        it('it should POST a core ', (done) => {
            let core = {
                "name": "cs02s0",
                "topology_name": "hvss-16s6",
                "host": "10.40.2.108",
                "user": "ccap",
                "password": "passw",
                "port": 2022
            }
            chai.request(server)
                .post('/api/cores')
                .send(core)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name').eql(core.name);
                    done();
                });
        });


    });
    /*
     * Test the /GET route
     */
    describe('/GET core', () => {
        it('it should GET all the cores', (done) => {
            chai.request(server)
                .get('/api/cores')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
        it('it should GET a core by the given id', (done) => {
            let core = new Core({
                "name": "cs02s0",
                "topology_name": "hvss-16s6",
                "host": "10.40.2.108",
                "user": "ccap",
                "password": "passw",
                "port": 2022
            })
            core.save((err, _core) => {
                chai.request(server)
                    .get('/api/cores/' + _core.id)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id').eql(_core.id);
                        done();
                    });
            });

        });
    });
    /*
     * Test the /PUT route
     */
    describe('/PUT/:id core', () => {
        it('it should PUT a core by the given id and update existing record', (done) => {
            let core_1 = new Core({
                "name": "cs02s0",
                "topology_name": "hvss-16s6",
                "host": "10.40.2.108",
                "user": "ccap",
                "password": "passw",
                "port": 2022
            });
            let core_2 = {
                "name": "cs02s0",
                "topology_name": "hvss-155",
                "host": "10.40.2.109",
                "user": "ccap",
                "password": "passw",
                "port": 2023
            }
            core_1.save((err, _core_1) => {
                chai.request(server)
                    .put('/api/cores/' + _core_1.id)
                    .send(core_2)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('topology_name').eql(core_2.topology_name);
                        res.body.should.have.property('host').eql(core_2.host);
                        res.body.should.have.property('port').eql(core_2.port);
                        done();
                    });
            });
        });
    });
    /*
     * Test the /DELETE route
     */
    describe('/DELETE/:id core', () => {
        it('it should DELETE a core given the id', (done) => {
            let core_1 = new Core({
                "name": "cs02s0",
                "topology_name": "hvss-155",
                "host": "10.40.2.109",
                "user": "ccap",
                "password": "passw",
                "port": 2023
            });
            core_1.save((err, _core_1) => {
                chai.request(server)
                    .delete('/api/cores/' + _core_1.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id').eql(_core_1.id);
                        done();
                    })
            })

        });
    });


});