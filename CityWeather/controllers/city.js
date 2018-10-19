"use strict";

function list (req, res){
    res.send(200, "city list goes here");
}

module.exports = {
    list: list,
}
