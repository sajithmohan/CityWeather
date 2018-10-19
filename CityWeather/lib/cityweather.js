'use strict';

var request = require('request-promise');
var errors = require('restify-errors');
var utils = require('../lib/utils.js');

class CityWeather{
    constructor(id) {
        this.cityId = id;
    }

    async load(){
        var options = {
            uri: 'http://api.openweathermap.org/data/2.5/weather',
            method: 'GET',
            qs: {
                id : this.cityId,
                APPID: utils.getEnvVal('OPENWEATHERMAP_APIKEY')
            },
            json: true,
            resolveWithFullResponse: true
        };
        try{
            var response =  await request(options);
            this.weather = response.body;
        }
        catch(err){
            if(err.name == 'StatusCodeError'){
                throw new errors.NotFoundError('City not found');
            }
            throw new errors.InternalServerError('Something went wrong');
        }
    }

    toJSON(){
        return {
            type: this.weather.weather[0].main,
            type_description: this.weather.weather[0].description,
            sunrise: new Date(this.weather.sys.sunrise).toISOString(),
            sunset: new Date(this.weather.sys.sunset).toISOString(),
            temp: this.weather.main.temp,
            temp_min: this.weather.main.temp_min,
            temp_max: this.weather.main.temp_max,
            pressure: this.weather.main.pressure,
            humidity: this.weather.main.humidity,
            clouds_percent: this.weather.clouds.all,
            wind_speed: this.weather.wind.speed
        };
    }
}

module.exports = CityWeather;