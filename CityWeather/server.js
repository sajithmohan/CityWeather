"use strict";

var restify = require('restify');
var routes = require('./routes');

var server = restify.createServer();
routes.loadRoutes(server);
server.use(restify.plugins.queryParser({ mapParams: false }));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});