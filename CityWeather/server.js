'use strict';

var restify = require('restify');
var mongoose = require('mongoose');
require('./models/city.js');
var routes = require('./routes');
var utils = require('./lib/utils.js');

mongoose.connect(`mongodb://${utils.getEnvVal('MONGO_HOST')}:${utils.getEnvVal('MONGO_PORT')}/${utils.getEnvVal('MONGO_DB')}`, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

var server = restify.createServer();
routes.loadRoutes(server);
server.use(restify.plugins.queryParser({ mapParams: false }));
server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;