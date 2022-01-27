var Team = require("../models/team");
var Position = require("../models/position");
var Player = require("../models/player");

const fs = require("fs")
const async = require("async");
const axios = require("axios");
const {body, validationResult} = require("express-validator");

axios.defaults.baseURL = '<Your Website Path>/haikyuu/';

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

exports.team_detail = function(req, res, next){ // Fetching Team Data and players in that team.
    async.parallel({
        team: function(callback){
            Team.findById(req.params.teamID).exec(callback);
        },
        team_players: function(callback){
            Player.find({"player_team":req.params.teamID}).populate("player_position").exec(callback);
        }
    }, function(err, results){
        if(err) return next(err);
        if (results.team==null) {
            var err = new Error('Team not found');
            err.status = 404;
            return next(err);
        }
        res.render("team_detail",{title:"Detailed Team View", teamData:results.team, playerData: results.team_players});
    });

};

exports.team_create_get = function(req, res, next){
    res.render("team_create",{title:"Create a New Team"});
}

exports.team_create_post = [//POST processing of Position creation.
    // Validations and error messags.
    body("team_name").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets.").escape(),
    body("team_region").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets.").escape(),
    body("team_motto").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets.").escape(),

    (req,res,next) => {
        const errors = validationResult(req);
        var team = new Team(
            {
                team_title: req.body.team_name,
                team_region: req.body.team_region,
                team_motto: req.body.team_motto,
                team_image: "/image_handling/teams/" + req.file.filename
            }
        );
        if(!errors.isEmpty()){  // If errors are present we go back to the creation page with error data which can be corrected.
            fs.unlinkSync("public/"+team.team_image)        // Error in team creation, hence image uploaded is deleted.
            console.log("File Deleted, error during Team Creation.")
            team.team_image = "";
            res.render("team_create", {title: " Create a New Team", teamData:team, errors: errors.array()});
            return;            
        } else {          
            Team.findOne({"team_title":req.body.team_name})
            .exec(function(err, team_available){
                if(err) { return next(err); }
                if(team_available){ // If Team with same name is already available, application redirects to that team's page.
                    fs.unlinkSync("public/"+team.team_image)        // Error in team creation, hence image uploaded is deleted.
                    console.log("File Deleted, error during successful Team Creation. Team already exists.")
                    res.redirect(team_available.url);
                } else {
                    team.save(function(err){    // If No errors and no team with same name is present, we save the team in the DB.
                        if(err) { return next(err); }
                        res.redirect(team.url);
                    });
                }
            });
        }
    }

];

exports.team_delete_get = function(req, res, next){ // Position and players in that position are fetched for Deletion action.

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
        res.render("team_delete",{title:"Delete Team", teamData: results.team, playerData: results.players, formType:"Delete"});
    })
}

exports.team_delete_post = async function(req, res, next){    // POST processing of Delete action in Position.

    // Call to check whether password entered during delete operation is valid or not.   
    let passwordValidity =  await axios.post("teams/authenticate", { username: "admin",password: req.body.passwordForAction}).then(result => result.data.validity);

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
            res.render("team_delete", {title: "Delete Team", teamData: results.team, playerData: results.players, formType:"Delete"});
        } else if(!passwordValidity){ // If password fails authentication, we go back to the previous page so that user can enter correct password.
            res.render("team_delete", {title: "Delete Team", teamData: results.team, playerData: results.players, formType:"Delete", actionErr : "Incorrect password. Deletion failed. Try again."});
        } else {
            Team.findByIdAndDelete(req.body.team_id, function deleteTeam(err){
                if(err) { return next(err); }
                fs.unlinkSync("public/"+results.team.team_image)        // File deleted during team deletion.
                console.log("File Deleted during team deletion.")
                res.redirect("/haikyuu/teams");  
            });
        }
    })
}

exports.team_update_get = function(req, res, next){ // For updating a team, we fetch that team's data.

    Team.findById(req.params.teamID).exec(function(err, team){ 
        if(err) { return next(err); }
        if(team == null){
            var err = new Error('Team not found');
            err.status = 404;
            return next(err);
        }
        res.render("team_create", {title: "Update Team Details", teamData: team, formType:"Update"})
    })

}

exports.team_update_post = [ // POST processing of Player update action.
    // Validations and error messages same as position creation.
    body("team_name").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets.").escape(),
    body("team_region").trim().isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets.").escape(),
    body("team_motto").trim().isAlpha('en-US', {ignore:' '}).withMessage("Use alphabets.").escape(),

    async (req,res,next) => {

        const errors = validationResult(req);

        // Call to check whether password entered during update operation is valid or not.   
        let passwordValidity =  await axios.post("teams/authenticate", { username: "admin",password: req.body.passwordForAction}).then(result => result.data.validity);

        var team = new Team(
            {
                team_title: req.body.team_name,
                team_region: req.body.team_region,
                team_motto: req.body.team_motto,
                team_image: "",                
                _id: req.params.teamID
            }
        );

        Team.findById(req.params.teamID, 'team_image').exec(function(err, result){
            if(err) { return next(err);}

            if(!errors.isEmpty() || !passwordValidity){
                if(req.file){
                    fs.unlinkSync("public/image_handling/teams/"+req.file.filename);
                    console.log("New File Deleted during erroneous Team Update operation.")
                }
                team.team_image = result.team_image;
            }

            if(!errors.isEmpty()){   // if errors are present we go back to update page with error data so that it can be correct.       
                res.render("team_create", {title: " Update Team Details", teamData:team, errors: errors.array(), formType:"Update"});
            } else if(!passwordValidity){   // If password fails authentication, we go back to the previous page so that user can enter correct password.
                res.render("team_create", {title: " Update Team Details", teamData:team,  formType:"Update", actionErr:"Incorrect password. Update failed. Try again."});               
            } else {
                if (req.file){
                    team.team_image = "/image_handling/teams/" + req.file.filename;
                    fs.unlinkSync("public/"+result.team_image)        //Unlink old team logo/image.
                    console.log("Old File Deleted during successful Team Update operation.")
                } else 
                    team.team_image = result.team_image;

                Team.findByIdAndUpdate(req.params.teamID, team, {}, function(err, theTeam){
                    if(err) { return next(err); }
                    res.redirect(theTeam.url);
                });
            }
        });
    }
]

exports.team_list = function(req, res, next){   // Fetch all the tams available specifically the field team_title.

    Team.find({}, {'team_title':1, 'team_image':1})
    .sort({team_title:1})
    .exec(function(err, results){
        if(err) return next(err);
        res.render("team_list", {title:"Teams in Haikyuu", teamData: results});
    })
}