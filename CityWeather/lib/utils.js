'use strict';
var errors = require('restify-errors');

module.exports = {
    promiseController: promiseController,
    getEnvVal: getEnvVal
};

function promiseController(fn){
    return async function(req, res, next){
        var error = null;
        try{
            await fn(req, res);
        }
        catch(err){
            error = err;
        }
        return next(error);
    };
}


function getEnvVal(key){
    if(process.env.hasOwnProperty(key)){
        return process.env[key];
    }
    throw new errors.InternalServerError(`Environment variable: '${key}'' not set`);
}