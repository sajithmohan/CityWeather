'use strict';

const mongoose = require('mongoose');
const City = mongoose.model('City');
const confg = require('../config.js');
var errors = require('restify-errors');

/**
 * @api {get} /cities List
 * @apiName List
 * @apiGroup Cities
 *
 * @apiParam (QueryParam) {Number} lat Latitude value.
 * @apiParam (QueryParam) {Number} lon Longitude value.
 *
 * @apiSuccess (200) {Number} page current page.
 * @apiSuccess (200) {Number} pages total pages.
 * @apiSuccess (200) {Object[]} data cities.
 * @apiSuccess (200) {String} data.name City name.
 * @apiSuccess (200) {Number} data.id City id.
 *
 * @apiError (400) {String} code error code
 * @apiError (400) {String} message error message
 */
const list = async function(req, res){
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const limit = confg.defaultPageLimit;

    var options = {
        page: page,
        limit: limit
    };

    const latitude = req.query.lat;
    const longitude = req.query.lon;

    if(validate_location(longitude, latitude)){
        options['location'] = {
            lon: longitude,
            lat: latitude
        };
    }

    let [cities, count] = await Promise.all(City.list(options, true));
    var response = {
        page: page + 1,
        pages: Math.ceil(count / limit),
        data: cities
    };
    res.send(200, response);
};

/**
 * @api {get} /cities/:id Details
 * @apiName Details
 * @apiGroup Cities
 *
 * @apiParam  {Number} id City id.
 *
 * @apiSuccess {Object} data City.
 * @apiSuccess {Object} data.coord Coordnates
 * @apiSuccess {Number} data.coord.lon Longitude.
 * @apiSuccess {Number} data.coord.lat Latitude.
 * @apiSuccess {Number} data.id City id.
 * @apiSuccess {String} data.name Name.
 * @apiError (400) {String} code error code
 * @apiError (400) {String} message error message
 * @apiError (404) {String} code error code
 * @apiError (404) {String} message error message
 */
const details = async function(req, res){
    const id = req.params.id;
    let city = await City.details(id);
    if(city !== null){
        var response = {
            'data': city
        };
        res.send(200, response);
    }
    throw new errors.NotFoundError('Not found');
};

/*
* Validate latittude longtitude
* Returns true if valid
* Return false if location undefined
* Throw error if invalid
*/
function validate_location(longitude, latitude){
    if(latitude === undefined || longitude === undefined){
        throw new errors.BadRequestError('lat/lon required');
    }
    if(latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180){
        throw new errors.BadRequestError('Invalid latitude or longitude value(s)');
    }
    return true;
}

module.exports = {
    list: list,
    details: details
};
