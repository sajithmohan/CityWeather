'use strict';

const CityWeather = require('../lib/cityweather.js');

const list = async (req, res) =>{
    const cityId = req.params.id;
    var cw = new CityWeather(cityId);
    await cw.load();
    res.send(200, cw);
};

module.exports = {
    list: list,
};