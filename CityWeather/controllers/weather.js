'use strict';

const CityWeather = require('../lib/cityweather.js');

/**
 * @api {get} /cities/:id/weather Details
 * @apiName weather Details
 * @apiGroup Weather
 *
 * @apiParam  {Number} id City id.
 *
 * @apiSuccess {Object} data Weather.
 * @apiSuccess {String} data.type type
 * @apiSuccess {String} data.type_description description
 * @apiSuccess {String} data.sunrise sunrise
 * @apiSuccess {String} data.sunset sunset
 * @apiSuccess {Number} data.temp temp.
 * @apiSuccess {Number} data.temp_min temp_min.
 * @apiSuccess {Number} data.temp_max temp_max.
 * @apiSuccess {Number} data.pressure pressure.
 * @apiSuccess {Number} data.humidity humidity.
 * @apiSuccess {Number} data.clouds_percent clouds_percent.
 * @apiSuccess {Number} data.wind_speed wind_speed.
 *
 * @apiError (400) {String} code error code
 * @apiError (400) {String} message error message
 * @apiError (404) {String} code error code
 * @apiError (404) {String} message error message
 */

const list = async (req, res) =>{
    const cityId = req.params.id;
    var cw = new CityWeather(cityId);
    await cw.load();
    res.send(200, {data: cw});
};

module.exports = {
    list: list,
};