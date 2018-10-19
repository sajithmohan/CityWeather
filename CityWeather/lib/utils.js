"use strict";
module.exports = {
    promiseController:  (fn)=>{
        return async(req, res, next) => {
            var error = null;
            try{
                await fn(req, res);
            }
            catch(err){
                error = err;
            }
            return next(error);
        }
    }
}