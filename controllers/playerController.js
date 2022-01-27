var Player = require("../models/player");
var Team = require("../models/team");
var Position = require("../models/position");

const fs = require("fs")
const async = require("async");
const axios = require("axios");
const {body,  validationResult, check} = require("express-validator");

axios.defaults.baseURL = 'https://lit-ridge-83224.herokuapp.com/haikyuu/';

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
            player_team : req.body.playerTeam,
            player_image: "/image_handling/players/" + req.file.filename
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
                fs.unlinkSync("public/"+player.player_image)        // Error in player creation, hence image uploaded is deleted.
                console.log("File Deleted, error during Player Creation.")
                player.player_image = "";
                res.render("player_create", {title:"Create a New Player", teamData: results.teams, positionData: results.positions, errors : errors.array(), playerData: player});
            });
            return
        } else {
            Player.findOne({"player_name":req.body.playerName}).exec(function(err, playerAvailable){
                if(err) { return next(err); }
                if(playerAvailable){     // If Player with same name is already available, application redirects to that player's page.
                    fs.unlinkSync("public/"+player.player_image)        // Error in player creation, hence image uploaded is deleted.
                    console.log("File Deleted, error during successfull Player Creation. Player already exists.")
                    res.redirect(playerAvailable.url);
                } else {
                    player.save(function(err){  // If No errors, we can save the data in the DB.
                        if(err) { return next(err); }
                        res.redirect(player.url);
                    });
                }
            });
        }
    }
]

exports.player_delete_get = function(req, res, next){ // Fetching player data for deletion processing.

    Player.findById(req.params.playerID)
    .populate("player_position")
    .populate("player_team")
    .exec(function(err, results){
        if(err) { return next(err); }
        res.render("player_delete", {title: "Delete Player", playerData:results, formType:"Delete"});
    })
}

exports.player_delete_post = async function(req, res, next){  // POST processing for deletion of a Player.

 // Call to check whether password entered during delete operation is valid or not.   
    let passwordValidity =  await axios.post("players/authenticate", { username: "admin",password: req.body.passwordForAction}).then(result => result.data.validity);
    
    Player.findById(req.body.player_id).populate("player_position").populate("player_team").exec(function(err, results){
        if(err) { return next(err); }
        if(!passwordValidity){  // If password fails authentication, we go back to the previous page so that user can enter correct password.
            res.render("player_delete", {title: "Delete Player", playerData:results, actionErr : "Incorrect password. Deletion failed. Try again."});
        } else {
            Player.findByIdAndDelete(req.body.player_id, function deletePlayer(err){
                if(err) { return next(err); }
                fs.unlinkSync("public/"+results.player_image)        // File deleted during player deletion.
                console.log("File Deleted during player deletion.")
                res.redirect("/haikyuu/players");
            });
        }
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
        res.render("player_create", {title:"Update Player Details", teamData: results.teams, positionData: results.positions, playerData: results.playerData, formType: "Update" });
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

    async (req, res, next) => {

        const errors = validationResult(req);

        // Call to check whether password entered during update operation is valid or not.       
        let passwordValidity =  await axios.post("positions/authenticate", { username: "admin",password: req.body.passwordForAction}).then(result => result.data.validity);

        var player = new Player({
            player_name : req.body.playerName,
            player_age : req.body.playerAge,
            player_position :  req.body.playerPosition,
            player_team : req.body.playerTeam,
            player_image: "",
            _id: req.params.playerID
        });

        async.parallel({
            teams: function(callback){
                Team.find({},"team_title").exec(callback);
            },
            positions: function(callback){
                Position.find({},"position_title").exec(callback);
            },
            oldPlayer: function(callback){
                Player.findById(req.params.playerID,'player_image').exec(callback);
            }
        }, function(err, results){
            if(err) { return next(err); }

            if(!errors.isEmpty() || !passwordValidity)  // Delete newly uploaded files if there is an error in other fields or password auhentication has failed.
                if(req.file){
                    fs.unlinkSync("public/image_handling/players/"+req.file.filename);
                    console.log("New File Deleted during erroneous Player Update operation. Incorrect Password.")
                }
                player.player_image = results.oldPlayer.player_image;
            
            if(!errors.isEmpty()){   // if errors are present we go back to update page with error data so that it can be correct.
                res.render("player_create", {title:"Update Player Details", teamData: results.teams, positionData: results.positions, errors : errors.array(), playerData: player, formType:"Update"});
            } else if(!passwordValidity){   // If password fails authentication, we go back to the previous page so that user can enter correct password.
                res.render("player_create", {title:"Update Player Details", teamData: results.teams, positionData: results.positions, playerData: player, formType:"Update", actionErr:"Incorrect password. Update failed. Try again."});
            } else {
                if (req.file) {
                    player.player_image = "/image_handling/players/" + req.file.filename;
                    fs.unlinkSync("public/"+results.oldPlayer.player_image)        //Unlink old player image.
                    console.log("Old File Deleted during successful Player Update operation.")
                } else
                    player.player_image = results.oldPlayer.player_image;

                Player.findByIdAndUpdate(req.params.playerID, player, {}, function(err, thePlayer){
                    if(err) { return next(err); }
                    res.redirect(thePlayer.url)
                });   
            };
        }); 
    }
]

exports.player_list = function(req, res, next){ // Fetching all players available in the DB.

    Player.find({}, {"player_name":1, "player_image":1})
    .sort({player_name:1})
    .exec(function(err, result){
        if(err) { return next(err); }
        res.render("player_list", {title:"Players in Haikyuu", playerData: result})
    });
}