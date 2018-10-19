'use strict';

var mongoose = require('mongoose');
var conf = require('../config');

var citySchema = new mongoose.Schema({
    _id:Number,
    name: String,
    country: String,
    coord:{
        lon: Number,
        lat: Number
    }
});
citySchema.index({coord: '2dsphere'});

citySchema.statics = {
    list: list,
    details: details
};

citySchema.options.toJSON = {
    /*
    * Rename _id of every document to id before returning the result
    */
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
};


mongoose.model('City', citySchema);

/*
* List Cities
*/
function list(options, count=true){
    var query = {};
    var countQuery = {};
    if(options.hasOwnProperty('location')){
        /*
        * use $near to get result sorted by distance
        * distance is in meters
        */
        query.coord = {
            $nearSphere:{
                $maxDistance: conf.citySearchRadius,
                $geometry: {
                    type: 'Point',
                    coordinates: [options.location.lon, options.location.lat]
                }
            }
        };
        /*
        * use $geoWithin to get result count(distance is in unit of degree)
        * The equatorial radius of the Earth is approximately 6,378.1 kilometers
        */
        countQuery.coord = {
            $geoWithin: {
                $centerSphere: [ [options.location.lon, options.location.lat] , conf.citySearchRadius/6378100]
            }
        };
    }
    if(count){
        return [
            this.find(query, {_id:1, name:1}).limit(options.limit).skip(options.limit * options.page).exec(),
            this.countDocuments(countQuery).exec()
        ];
    }
    return this.find(query).limit(options.limit).skip(options.limit * options.page).exec();
}


/*
* Get City details by id
*/
function details(id){
    return this.findOne(
        {_id:id},
        {_id:1, name:1, coord:1}
    ).exec();
}