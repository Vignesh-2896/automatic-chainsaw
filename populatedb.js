#! /usr/bin/env node

console.log('This script populates some teams, positions and players.')

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')

var Team = require("./models/team");
var Position = require("./models/position");
var Player = require("./models/player");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var teams = [];
var positions = [];
var players = [];


function teamCreate(team_title, team_motto, team_region, cb){

  var teamDetail = {team_title: team_title, team_motto: team_motto, team_region: team_region};
  var team = new Team(teamDetail);

  team.save(function(err){
    if(err){
      cb(err, null);
      return
    }
    //console.log("New Team : "+ team);
    teams.push(team);
    cb(null, team);
  })

}


function positionCreate(position_title, position_description, cb){

  var positionDetail = {position_title: position_title, position_description: position_description};
  var position = new Position(positionDetail);

  position.save(function(err){
    if(err){
      cb(err, null);
      return
    }
   //console.log("New Position : "+position);
    positions.push(position);
    cb(null, position);
  })

}

function playerCreate(player_name, player_age, player_position, player_team, cb){

  var playerDetail = {player_name: player_name, player_age: player_age, player_position: player_position, player_team: player_team};
  var player = new Player(playerDetail);

  player.save(function(err){
    if(err){
      cb(err, null)
      return
    }
    //console.log("New Player : "+player);
    players.push(player);
    cb(null, player);
  })

}

function createTeams(cb){

  async.parallel([
    function(callback){
      teamCreate("Karasuno High", "Fly", "Miyagi Prefecture", callback)
    },
    function(callback){
      teamCreate("Fukurōdani Academy", "Certain Victory", "Tokyo Prefecture", callback)
    },
    function(callback){
      teamCreate("Inarizaki High", "Who Needs Memories ?", "Hyogo Prefecture", callback)
    },
  ],
  cb)

}


function createPositions(cb){

  async.parallel([
    function(callback){
      positionCreate("Setter", "Playmakers of the volleyball team. Their responsibilities are to run the team's attacks and build up potential scoring opportunities for the team.  ", callback)
    },
    function(callback){
      positionCreate("Middle Blockers", "Players playing close to the net in the middle of the court. Their responsiblities are to stop fast plays and also perform equally fast attacks in return. ", callback)
    },
    function(callback){
      positionCreate("Libero", "Exclusive defensive position. Responsible for receiving an attack or serve. They are players quickest reaction time and best passing skills.", callback)
    },
    function(callback){
      positionCreate("Wing Spikers", "Highest point scorers who attack with the ball set by the Setter. Also carry serve recieve responsiblity. Can play back or front row.", callback)
    },
  ],
  cb)
}


function createPlayers(cb){
  
  async.parallel([
    function(callback){
      playerCreate("Shoyo Hinata", 15, [positions[1],], teams[0], callback)
    },
    function(callback){
      playerCreate("Tobio Kageyama", 15, [positions[0],], teams[0], callback)
    },
    function(callback){
      playerCreate("Osamu Miya", 17, [positions[3],], teams[2], callback)
    },
    function(callback){
      playerCreate("Kotaro Bokuto", 17, [positions[3],], teams[1], callback)
    },
    function(callback){
      playerCreate("Yu Nishinoya", 16, [positions[2],], teams[0], callback)
    },
    function(callback){
      playerCreate("Michinari Akagi", 18, [positions[2],], teams[2], callback)
    },
    function(callback){
      playerCreate("Rintaro Suna", 16, [positions[1],], teams[2], callback)
    },
    function(callback){
      playerCreate("Keiji Akaashi", 17, [positions[0],], teams[1], callback)
    }
  ],
  cb)
}


async.series([
    createTeams,
    createPositions,
    createPlayers
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('players: '+results);
        
    }
    console.log(teams)
    // All done, disconnect from database
    mongoose.connection.close();
});



