'use strict';

process.env.NODE_ENV = 'test';
process.env.MONGO_DB = 'test_cityweather';

var server = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
var nock = require('nock');

chai.should();
chai.use(chaiHttp);


const success_response = {
    'coord': {
        'lon': 34.28,
        'lat': 44.55
    },
    'weather': [
        {
            'id': 800,
            'main': 'Clear',
            'description': 'clear sky',
            'icon': '01d'
        }
    ],
    'base': 'stations',
    'main': {
        'temp': 291.176,
        'pressure': 1008.45,
        'humidity': 92,
        'temp_min': 291.176,
        'temp_max': 291.176,
        'sea_level': 1029.25,
        'grnd_level': 1008.45
    },
    'wind': {
        'speed': 2.55,
        'deg': 250.502
    },
    'clouds': {
        'all': 0
    },
    'dt': 1539949419,
    'sys': {
        'message': 0.0735,
        'country': 'UA',
        'sunrise': 1539921807,
        'sunset': 1539960684
    },
    'id': 707860,
    'name': 'Hurzuf',
    'cod': 200
};

const error_response = {
    'cod': '404',
    'message': 'city not found'
};

describe('Weather', function () {
    it('returns weather api with key', function(done){
        var called = false;
        nock('http://api.openweathermap.org').get('/data/2.5/weather').query(function(actualQueryObject){
            console.log('----->>', actualQueryObject);
            if(actualQueryObject.id == '123'){
                called = true;
                return true;
            }
        }).reply(200, success_response);

        chai.request(server).get('/cities/123/weather').end(function(err, res){
            res.body.type.should.be.eq('Clear');
            res.status.should.be.eq(200);
            called.should.be.eq(true);
            done();
        });
    });

    it('returns 404 for invalid key', function(done){
        var called = false;
        nock('http://api.openweathermap.org').get('/data/2.5/weather').query(function(actualQueryObject){
            if(actualQueryObject.id == '111'){
                called = true;
                return true;
            }
        }).reply(404, error_response);

        chai.request(server).get('/cities/111/weather').end(function(err, res){
            res.status.should.be.eq(404);
            called.should.be.eq(true);
            done();
        });
    });

});