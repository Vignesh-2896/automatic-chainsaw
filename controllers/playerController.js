var Player = require("../models/player");
var Team = require("../models/team");
var Position = require("../models/position");

const async = require("async");
const {body,  validationResult, check} = require("express-validator");

exports.player_detail = function(req, res, next){ // Fetching Player Data, its positions and the team.

    Player.findById(req.params.playerID)
    .populate("player_team")
    .populate("player_position")
    .exec(function(err, results){
        if(err) { return next(err); }
        res.render("player_detail", {title:"Detailed Player View", playerData:results});
    })
}

exports.player_create_get = function(req, res, next){   // Fetching all the positions and teams available so that player can be created under some of them.

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

exports.player_create_post = [      // POST handling of Player creation.
    (req, res, next) => {
        if(!(req.body.playerPosition instanceof Array)){
            if(typeof req.body.playerPosition === 'undefined')
                req.body.playerPosition = []
            else
                req.body.playerPosition = new Array(req.body.playerPosition);
        }
        next();
    }, 

    // Validations and error messages.
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

        if(!errors.isEmpty()){ // If errors are present in the data input we go back to the creation page, so that errors can be fixed.
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
            player.save(function(err){  // If No errors, we can save the data in the DB.
                if(err) { return next(err); }
                res.redirect(player.url);
            })
        }
    }
]

exports.player_delete_get = function(req, res, next){ // Fetching player data for deletion processing.

    Player.findById(req.params.playerID)
    .populate("player_position")
    .populate("player_team")
    .exec(function(err, results){
        if(err) { return next(err); }
        res.render("player_delete", {title: "Delete Player", playerData:results});
    })
}

exports.player_delete_post = function(req, res, next){  // POST processing for deletion of a Player.

    Player.findByIdAndRemove(req.body.player_id, function deletePlayer(err){
        if(err) { return next(err); }
        res.redirect("/haikyuu/players");
    });
}

exports.player_update_get = function(req, res, next){ // For updating a player, we fetch the player's details and of all the teams and positions so that they can also be changed.

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
        res.render("player_create", {title:"Update Player Details", teamData: results.teams, positionData: results.positions, playerData: results.playerData });
    });

}

exports.player_update_post = [ // POST processing of Player update action.
    (req, res, next) => {
        if(!(req.body.playerPosition instanceof Array)){
            if(typeof req.body.playerPosition === 'undefined')
                req.body.playerPosition = []
            else
                req.body.playerPosition = new Array(req.body.playerPosition);
        }
        next();
    }, 

    // Validations and error messages same as player creation.
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

        if(!errors.isEmpty()){   // if errors are present we go back to update page with error data so that it can be correct.
            async.parallel({
                teams: function(callback){
                    Team.find({},"team_title").exec(callback);
                },
                positions: function(callback){
                    Position.find({},"position_title").exec(callback);
                }
            }, function(err, results){
                if(err) { return next(err); }
                res.render("player_create", {title:"Update Player Details", teamData: results.teams, positionData: results.positions, errors : errors.array(), playerData: player});
            });
            return
        } else {
            Player.findByIdAndUpdate(req.params.playerID, player, {}, function(err, thePlayer){  // If no errors, then we can update the player data in DB.
                if(err) { return next(err); }
                res.redirect(thePlayer.url);
            });
        }
    }
]

exports.player_list = function(req, res, next){ // Fetching all players available in the DB.

    Player.find({}, "player_name")
    .sort({player_name:1})
    .exec(function(err, result){
        if(err) { return next(err); }
        res.render("player_list", {title:"Players in Haikyuu", playerData: result})
    });
}