var Player = require("../models/player");
var Team = require("../models/team");
var Position = require("../models/position");

const async = require("async");
const {body,  validationResult, check} = require("express-validator");

exports.player_detail = function(req, res, next){

    Player.findById(req.params.playerID)
    .populate("player_team")
    .populate("player_position")
    .exec(function(err, results){
        if(err) { return next(err); }
        res.render("player_detail", {title:"Detailed View of Player", playerData:results});
    })
}

exports.player_create_get = function(req, res, next){

    async.parallel({
        teams: function(callback){
            Team.find({},"team_title").exec(callback);
        },
        positions: function(callback){
            Position.find({},"position_title").exec(callback);
        }
    }, function(err, results){
        if(err) { return next(err); }
        res.render("player_create", {title:"Create a New Player", teamData: results.teams, positionData: results.positions});
    });
}

exports.player_create_post = [
    (req, res, next) => {
        if(!(req.body.playerPosition instanceof Array)){
            if(typeof req.body.playerPosition === 'undefined')
                req.body.playerPosition = []
            else
                req.body.playerPosition = new Array(req.body.playerPosition);
        }
        next();
    }, 

    body("playerName").trim().isLength({min:5}).withMessage("Minimum 5 characters neeeded").matches(/^[A-Za-z ]+$/).withMessage("Use alphabets.").escape(),
    body("playerAge").trim().isLength({min:2}).withMessage("Age to be between 15 and 20").escape(),
    body("playerTeam").trim().isLength({min:1}).withMessage("Team has to be selected").escape(),
    body('playerPosition.*').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var player = new Player({
            player_name : req.body.playerName,
            player_age : req.body.playerAge,
            player_position :  req.body.playerPosition,
            player_team : req.body.playerTeam
        });

        if(!errors.isEmpty()){
            async.parallel({
                teams: function(callback){
                    Team.find({},"team_title").exec(callback);
                },
                positions: function(callback){
                    Position.find({},"position_title").exec(callback);
                }
            }, function(err, results){
                if(err) { return next(err); }
                res.render("player_create", {title:"Create a New Player", teamData: results.teams, positionData: results.positions, errors : errors.array(), playerData: player});
            });
            return
        } else {
            player.save(function(err){
                if(err) { return next(err); }
                res.redirect(player.url);
            })
        }
    }
]

exports.player_delete_get = function(req, res, next){

    Player.findById(req.params.playerID)
    .populate("player_position")
    .populate("player_team")
    .exec(function(err, results){
        if(err) { return next(err); }
        res.render("player_delete", {title: "Delete Player", playerData:results});
    })
}

exports.player_delete_post = function(req, res, next){

    Player.findByIdAndRemove(req.body.player_id, function deletePlayer(err){
        if(err) { return next(err); }
        res.redirect("/haikyuu/players");
    });
}

exports.player_update_get = function(req, res, next){

    async.parallel({
        playerData: function(callback){
            Player.findById(req.params.playerID).exec(callback);
        },
        teams: function(callback){
            Team.find({},"team_title").exec(callback);
        },
        positions: function(callback){
            Position.find({},"position_title").exec(callback);
        }
    }, function(err, results){
        if(err) { return next(err); }
        res.render("player_create", {title:"Update Player Data", teamData: results.teams, positionData: results.positions, playerData: results.playerData });
    });

}

exports.player_update_post = [
    (req, res, next) => {
        if(!(req.body.playerPosition instanceof Array)){
            if(typeof req.body.playerPosition === 'undefined')
                req.body.playerPosition = []
            else
                req.body.playerPosition = new Array(req.body.playerPosition);
        }
        next();
    }, 

    body("playerName").trim().isLength({min:5}).withMessage("Minimum 5 characters neeeded").matches(/^[A-Za-z ]+$/).withMessage("Use alphabets.").escape(),
    body("playerAge").trim().isLength({min:2}).withMessage("Age to be between 15 and 20").escape(),
    body("playerTeam").trim().isLength({min:1}).withMessage("Team has to be selected").escape(),
    body('playerPosition.*').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var player = new Player({
            player_name : req.body.playerName,
            player_age : req.body.playerAge,
            player_position :  req.body.playerPosition,
            player_team : req.body.playerTeam,
            _id: req.params.playerID
        });

        if(!errors.isEmpty()){
            async.parallel({
                teams: function(callback){
                    Team.find({},"team_title").exec(callback);
                },
                positions: function(callback){
                    Position.find({},"position_title").exec(callback);
                }
            }, function(err, results){
                if(err) { return next(err); }
                res.render("player_create", {title:"Update Player Data", teamData: results.teams, positionData: results.positions, errors : errors.array(), playerData: player});
            });
            return
        } else {
            Player.findByIdAndUpdate(req.params.playerID, player, {}, function(err, thePlayer){ 
                if(err) { return next(err); }
                res.redirect(thePlayer.url);
            });
        }
    }
]

exports.player_list = function(req, res, next){

    Player.find({}, "player_name")
    .sort({player_name:1})
    .exec(function(err, result){
        if(err) { return next(err); }
        res.render("player_list", {title:"Players in Haikyuu", playerData: result})
    });
}