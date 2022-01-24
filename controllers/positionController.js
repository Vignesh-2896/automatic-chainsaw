var Position = require("../models/position");
var Player = require("../models/player");

const async = require("async");
const {body, validationResult} = require("express-validator");

exports.position_detail = function(req, res, next){

    async.parallel({
        position: function(callback){
            Position.findById(req.params.positionID).exec(callback)
        },
        players: function(callback){
            Player.find({'player_position':req.params.positionID}).exec(callback)
        }
    }, function(err, results){
        if(err) { return next(err); }
        if(results.position == null){
            var err = new Error('Position not found');
            err.status = 404;
            return next(err);            
        }
        res.render("position_detail",{title:"Detailed View of Position", positionData: results.position, playerData: results.players})
    })
}

exports.position_create_get = function(req, res, next){
    res.render("position_create",{title:"Create a New Position"});
}

exports.position_create_post = [
    body("positionName").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").matches(/^[A-Za-z ]+$/).withMessage("Use alphabets."),
    body("positionDescription").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").matches(/^[A-Za-z .]+$/).withMessage("Use alphabets."),

    (req, res, next) => {
        const errors = validationResult(req);

        var position = new Position({
            position_title: req.body.positionName,
            position_description: req.body.positionDescription
        });

        if(!errors.isEmpty()){
            res.render("position_create",{title:"Create a New Position", errors: errors.array(), positionData: position});
            return;
        } else {
            Position.findOne({"position_title":req.body.positionName}).exec(function(err, positionAvailable){
                if(err) { return next(err); }
                if(positionAvailable) {
                    res.redirect(positionAvailable.url);
                } else {
                    position.save(function(err){
                        if(err) { return next(err); }
                        res.redirect(position.url);
                    });
                }
            });
        }
    }
]

exports.position_delete_get = function(req, res, next){
    
    async.parallel({
        position: function(callback){
            Position.findById(req.params.positionID).exec(callback);
        },
        players: function(callback){
            Player.find({"player_position":req.params.positionID}).exec(callback);
        }
    }, function(err, results){
        if(err) { return next(err); }
        if(results.position == null){
            res.redirect("/haikyuu/positions");               
        }
        res.render("position_delete",{title:"Delete Position", positionData: results.position, playerData: results.players});
    })
}

exports.position_delete_post = function(req, res){

    async.parallel({
        position: function(callback){
            Position.findById(req.body.position_id).exec(callback);
        },
        players: function(callback){
            Player.find({"player_position":req.body.position_id}).exec(callback);
        }
    }, function(err, results){
        if(err) { return next(err); }
        if(results.players.length > 0){
            res.render("position_delete",{title:"Delete Position", positionData: results.position, playerData: results.players});
        } else {
            Position.findByIdAndDelete(req.body.position_id, function deletePosition(err){
                if(err) { return next(err); }
                res.redirect("/haikyuu/positions");
            })
        }
    })
}

exports.position_update_get = function(req, res, next){

    Position.findById(req.params.positionID).exec(function(err, position){
        if(err) { next(err); }
        if(position == null){
            var err = new Error('Position not found');
            err.status = 404;
            return next(err);
        }
        res.render("position_create", {title:"Update Position Details", positionData:position})
    });
}

exports.position_update_post = [
    body("positionName").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").matches(/^[A-Za-z ]+$/).withMessage("Use alphabets."),
    body("positionDescription").trim().isLength({min:5}).withMessage("Minimum 5 characters needed.").matches(/^[A-Za-z .]+$/).withMessage("Use alphabets."),

    (req, res, next) => {
        const errors = validationResult(req);

        var position = new Position({
            position_title: req.body.positionName,
            position_description: req.body.positionDescription,
            _id: req.params.positionID
        });

        if(!errors.isEmpty()){
            res.render("position_create",{title:"Update Position Details", errors: errors.array(), positionData: position});
            return;
        } else {
            Position.findByIdAndUpdate(req.params.positionID, position, {}, function(err, thePosition){
                if(err) { return next(err); }
                res.redirect(thePosition.url);
            })
        }
    } 
]

exports.position_list = function(req, res, next){

    Position.find({},'position_title')
    .sort({position_title:1})
    .exec(function(err, results){
        if(err) { return next(err); }
        res.render("position_list", {title:"Positions in Haikyuu", position_data:results});
    });
}