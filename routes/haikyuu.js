var express = require("express");
var router = express.Router();
var axios = require("axios");
var multer = require("multer");
var basicAuth = require("express-basic-auth");

var player = require("../controllers/playerController");
var position = require("../controllers/positionController");
var team = require("../controllers/teamController");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname === "teamImage")
      cb(null, 'public/image_handling/teams/')
    else
      cb(null, 'public/image_handling/players/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({storage : storage});

function myAuthorizer(username, password) { // Basic password auth using express-basic-auth.
  const userMatches = basicAuth.safeCompare(username, 'admin')
  const passwordMatches = basicAuth.safeCompare(password, '<Your Password>')

  return userMatches & passwordMatches
}

// Team routine.
router.get("/",team.site_index); // Homepage of Website

router.get("/team/create", team.team_create_get) // GET request to create a new Team

router.post("/team/create", upload.single('teamImage'), team.team_create_post) // POST request to create a new Team

router.get("/team/:teamID/delete", team.team_delete_get) // GET request to delete a Team

router.post("/team/:teamID/delete", team.team_delete_post) // POST request to delete a Team

router.get("/team/:teamID/update", team.team_update_get) // GET request to update a Team

router.post("/team/:teamID/update", upload.single('teamImage'), team.team_update_post) // POST request to update a Team

router.get("/team/:teamID", team.team_detail) // Detailed View of a Team

router.get("/teams", team.team_list) // GET request to fetch all Teams.

router.post("/teams/authenticate", async function(req, res){    // Route to which password can be authenticated for update or delete action on a team.
  let validCheck = myAuthorizer(req.body.username, req.body.password);
  res.status(200).json({validity:validCheck});
});

// Position routine.
router.get("/position/create", position.position_create_get) // GET request to create a new Position

router.post("/position/create", position.position_create_post) // POST request to create a new Position

router.get("/position/:positionID/delete", position.position_delete_get) // GET request to delete a Position

router.post("/position/:positionID/delete", position.position_delete_post) // POST request to delete a Position

router.get("/position/:positionID/update", position.position_update_get) // GET request to update a Position

router.post("/position/:positionID/update", position.position_update_post) // POST request to update a Position

router.get("/position/:positionID", position.position_detail) // Detailed View of a Position

router.get("/positions", position.position_list) // GET request to fetch all Positions.

router.post("/positions/authenticate", async function(req, res){  // Route to which password can be authenticated for update or delete action on a team.
  let validCheck = myAuthorizer(req.body.username, req.body.password);
  res.status(200).json({validity:validCheck});
});

// Player routine.
router.get("/player/create", player.player_create_get) // GET request to create a new Player

router.post("/player/create", upload.single('playerImage'), player.player_create_post) // POST request to create a new Player

router.get("/player/:playerID/delete", player.player_delete_get) // GET request to delete a Player

router.post("/player/:playerID/delete", player.player_delete_post) // POST request to delete a Player

router.get("/player/:playerID/update", player.player_update_get) // GET request to update a Player

router.post("/player/:playerID/update", upload.single('playerImage'), player.player_update_post) // POST request to update a Player

router.get("/player/:playerID", player.player_detail) // Detailed View of a Player.

router.get("/players", player.player_list) // GET request to fetch all Players.

router.post("/players/authenticate", async function(req, res){  // Route to which password can be authenticated for update or delete action on a team.
  let validCheck = myAuthorizer(req.body.username, req.body.password);
  res.status(200).json({validity:validCheck});
});

module.exports = router;