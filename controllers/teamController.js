var Team = require("../models/team");
var Position = require("../models/position");
var Player = require("../models/player");

const async = require("async");
const {body, validationResult} = require("express-validator");

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

exports.team_detail = function(req, res, next){
    async.parallel({
        team: function(callback){
            Team.findById(req.params.teamID).exec(callback);
        },
        team_players: function(callback){
            Player.find({"player_team":req.params.teamID}).exec(callback);
        }
    }, function(err, results){
        if(err) return next(err);
        if (results.team==null) {
            var err = new Error('Team not found');
            err.status = 404;
            return next(err);
        }
        res.render("team_detail",{title:"Detailed Team View", team_data:results.team, player_data: results.team_players});
    });

};

exports.team_create_get = function(req, res, next){
    res.render("team_create",{title:"Create a New Team"});
}

exports.team_create_post = [

    body("team_name").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets."),
    body("team_region").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets."),
    body("team_motto").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha().withMessage("Use alphabets."),

    (req,res,next) => {
        const errors = validationResult(req);
        var team = new Team(
            {
                team_title: req.body.team_name,
                team_region: req.body.team_region,
                team_motto: req.body.team_motto
            }
        );
        if(!errors.isEmpty()){
            res.render("team_create", {title: " Create a New Team", teamData:team, errors: errors.array()});
            return;
        } else {
            Team.findOne({"team_title":req.body.team_name})
            .exec(function(err, team_available){
                if(err) { return next(err); }
                if(team_available){
                    res.redirect(team_available.url);
                } else {
                    team.save(function(err){
                        if(err) { return next(err); }
                        res.redirect(team.url);
                    });
                }
            });
        }
    }

];

exports.team_delete_get = function(req, res, next){

    async.parallel({
        team: function(callback){
            Team.findById(req.params.teamID).exec(callback)
        },
        players: function(callback){
            Player.find({player_team:req.params.teamID}).exec(callback)
        },
    }, function(err, results){
        if(err) { return next(err); }
        if(results.team==null){
            res.redirect("/haikyuu/teams");
        }
        res.render("team_delete",{title:"Delete Team", team_data: results.team, player_data: results.players});
    })
}

exports.team_delete_post = function(req, res, next){

    async.parallel({
        team: function(callback){
            Team.findById(req.body.team_id).exec(callback);
        },
        players: function(callback){
            Player.find({player_team:req.body.team_id}).exec(callback);
        },
    }, function(err, results){
        if(err) { return next(err); }
        if(results.players.length > 0){
            res.render("team_delete", {title: "Delete Team", team_data: results.team, player_data: results.players});
        }
        else {
            Team.findByIdAndDelete(req.body.team_id, function deleteTeam(err){
                if(err) { return next(err); }
                res.redirect("/haikyuu/teams");
            });
        }
    })
}

exports.team_update_get = function(req, res, next){

    Team.findById(req.params.teamID).exec(function(err, team){ 
        if(err) { return next(err); }
        if(team == null){
            var err = new Error('Team not found');
            err.status = 404;
            return next(err);
        }
        res.render("team_create", {title: "Update Team", teamData: team})
    })

}

exports.team_update_post = [

    body("team_name").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets."),
    body("team_region").trim().isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets."),
    body("team_motto").trim().isAlpha().withMessage("Use alphabets."),

    (req,res,next) => {

        const errors = validationResult(req);
        var team = new Team(
            {
                team_title: req.body.team_name,
                team_region: req.body.team_region,
                team_motto: req.body.team_motto,
                _id: req.params.teamID
            }
        );

        if(!errors.isEmpty()){
            res.render("team_create", {title: " Update Team", teamData:team, errors: errors.array()});
            return;
        } else {
            Team.findByIdAndUpdate(req.params.teamID, team, {}, function(err, theTeam){
                if(err) { return next(err); }
                res.redirect(theTeam.url)
            })
        }
    }
]

exports.team_list = function(req, res, next){

    Team.find({}, 'team_title')
    .sort({team_title:1})
    .exec(function(err, results){
        if(err) return next(err);
        res.render("team_list", {title:"Teams in Haikyuu", team_data: results});
    })
}