"use strict";

const utils = require('./lib/utils.js');
const errs = require('restify-errors');
const cityController = require('./controllers/city.js');

function loadRoutesfn(server){
    server.get('/cities', utils.promiseController(cityController.list));
}

module.exports = {
    loadRoutes: loadRoutesfn
}





