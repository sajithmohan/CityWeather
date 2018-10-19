'use strict';

const utils = require('./lib/utils.js');
const cityController = require('./controllers/city.js');

const loadRoutesfn = (server) =>{
    server.get('/cities', utils.promiseController(cityController.list));
    server.get('/cities/:id', utils.promiseController(cityController.details));
};

module.exports = {
    loadRoutes: loadRoutesfn
};

