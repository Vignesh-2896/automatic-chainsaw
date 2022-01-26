const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    player_name: {type:String, required:true},
    player_age: {type:Number, required:true},
    player_position: [{type: Schema.Types.ObjectId, ref: "Position", required:true}],
    player_team: {type:Schema.Types.ObjectId, ref: "Team", required:true},
    player_image: {type:String, required:true}
});

PlayerSchema
.virtual("url")
.get(function(){
    return "/haikyuu/player/" + this._id;
})

module.exports = mongoose.model("Player",PlayerSchema);