'use strict';

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
var server = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const City = mongoose.model('City');

var Novinki = {
    '_id': 519188,
    'name': 'Novinki',
    'country': 'RU',
    'coord': {
        'lon': 37.666668,
        'lat': 55.683334
    }
};



describe('City', function () {

    before(function(done) {
        var cities = [];
        for(var i=1; i<=15; i++){
            cities.push({
                _id: i,
                name: 'city'+i,
                country: 'RU',
                coord: {
                    lon: 80,
                    lat: 10+(i*0.00001)
                }
            });
        }
        cities.push(Novinki);
        City.insertMany(cities, function(){
            done();
        });

    });

    describe('/GET cities', function () {
        it('returns cities if provide lat, lon', function (done) {
            chai.request(server).get('/cities?lat=55.763334&lon=37.666668').end(function(err, res){
                res.should.have.status(200);
                res.body.data.length.should.be.eql(1);
                done();
            });
        });

        it('returns max 10 near by cities at once', function (done) {
            chai.request(server).get('/cities?lat=10&lon=80').end(function(err, res){
                res.should.have.status(200);
                res.body.data.length.should.be.eql(10);
                res.body.page.should.be.eql(1);
                res.body.pages.should.be.eql(2);
                done();
            });
        });

        it('returns remaining near by cities on page 2', function (done) {
            chai.request(server).get('/cities?lat=10&lon=80&page=2').end(function(err, res){
                res.should.have.status(200);
                res.body.data.length.should.be.eql(5);
                res.body.page.should.be.eql(2);
                res.body.pages.should.be.eql(2);
                done();
            });
        });

        it('exculde city if distance greater than 10 km', function (done) {
            chai.request(server).get('/cities?lat=55.773334&lon=37.666668').end(function(err, res){
                res.should.have.status(200);
                res.body.data.length.should.be.eql(0);
                done();
            });
        });

        it('return error with out lat/lon', function (done) {
            chai.request(server).get('/cities').end(function(err, res){
                res.should.have.status(400);
                res.body.code.should.be.eql('BadRequest');
                res.body.message.should.be.eql('lat/lon required');
                done();
            });
        });

        it('return error with lat less than -90', function (done) {
            chai.request(server).get('/cities?lat=-91&lon=37.666668').end(function(err, res){
                res.should.have.status(400);
                res.body.code.should.be.eql('BadRequest');
                res.body.message.should.be.eql('Invalid latitude or longitude value(s)');
                done();
            });
        });
        it('return error with lat greater than 90', function (done) {
            chai.request(server).get('/cities?lat=91&lon=37.666668').end(function(err, res){
                res.should.have.status(400);
                res.body.code.should.be.eql('BadRequest');
                res.body.message.should.be.eql('Invalid latitude or longitude value(s)');
                done();
            });
        });
        it('return error with lon greater than 180', function (done) {
            chai.request(server).get('/cities?lat=55.773334&lon=180.666668').end(function(err, res){
                res.should.have.status(400);
                res.body.code.should.be.eql('BadRequest');
                res.body.message.should.be.eql('Invalid latitude or longitude value(s)');
                done();
            });
        });
        it('return error with lon less than -180', function (done) {
            chai.request(server).get('/cities?lat=91&lon=-180.666668').end(function(err, res){
                res.should.have.status(400);
                res.body.code.should.be.eql('BadRequest');
                res.body.message.should.be.eql('Invalid latitude or longitude value(s)');
                done();
            });
        });

    });
    describe('/GET cities/:id', function () {
        it('return city details for valid id', function (done) {
            chai.request(server).get('/cities/519188').end(function(err, res){
                res.should.have.status(200);
                res.body.data.id.should.be.eq(519188);
                res.body.data.name.should.be.eq('Novinki');
                res.body.data.coord.lon.should.be.eq(37.666668);
                res.body.data.coord.lat.should.be.eq(55.683334);
                done();
            });
        });
        it('return 404 for invalid id', function (done) {
            chai.request(server).get('/cities/51918899').end(function(err, res){
                res.should.have.status(404);
                res.body.code.should.be.eq('NotFound');
                res.body.message.should.be.eq('Not found');
                done();
            });
        });
    });
});

