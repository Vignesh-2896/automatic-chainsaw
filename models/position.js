const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PositionSchema = new Schema({
    position_title: {type:String, required:true},
    position_description: {type:String, required:true}
})

PositionSchema
.virtual("url")
.get(function(){
    return "/haikyuu/position/" + this._id;
})

module.exports = mongoose.model("Position", PositionSchema)