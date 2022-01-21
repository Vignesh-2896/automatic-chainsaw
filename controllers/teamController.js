var Team = require("../models/team");
var Position = require("../models/position");
var Player = require("../models/player");

const async = require("async");

exports.site_index = function(req, res, next){

    async.parallel({
        teamCount: function(callback){
            Team.countDocuments({},callback);
        },
        positionCount: function(callback){
            Position.countDocuments({}, callback);
        },
        playerCount: function(callback){
            Player.countDocuments({}, callback);
        }
    }, function(err, results){
        res.render("index",{title: "Haikyuu Inventory", err : err, data: results});
    });
}

exports.team_detail = function(req, res){
    res.send("NOT Implemented: TEAM Detail Page" + req.params.id)
}

exports.team_create_get = function(req, res){
    res.send("NOT Implemented: TEAM Create GET Page")
}

exports.team_create_post = function(req, res){
    res.send("NOT Implemented: TEAM Create POST Page")
}

exports.team_delete_get = function(req, res){
    res.send("NOT Implemented: TEAM Delete GET Page")
}

exports.team_delete_post = function(req, res){
    res.send("NOT Implemented: TEAM Delete POST Page")
}
exports.team_update_get = function(req, res){
    res.send("NOT Implemented: TEAM Update GET Page")
}

exports.team_update_post = function(req, res){
    res.send("NOT Implemented: TEAM Update POST Page")
}

exports.team_list = function(req, res){
    res.send("NOT Implemented: TEAM List Page");
}