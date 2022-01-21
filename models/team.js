const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var TeamSchema = new Schema({
    team_title: {type:String, required:true},
    team_motto: {type:String, required:true},
    team_region: {type:String, required:true}
})

TeamSchema
.virtual("url")
.get(function(){
    return "/haikyuu/team/" + this._id;
})

module.exports = mongoose.model("Team", TeamSchema)