'use strict';

const utils = require('./lib/utils.js');
const cityController = require('./controllers/city.js');
const weatherController = require('./controllers/weather.js');

const loadRoutesfn = (server) =>{
    server.get('/cities', utils.promiseController(cityController.list));
    server.get('/cities/:id', utils.promiseController(cityController.details));
    server.get('/cities/:id/weather', utils.promiseController(weatherController.list));
};

module.exports = {
    loadRoutes: loadRoutesfn
};

