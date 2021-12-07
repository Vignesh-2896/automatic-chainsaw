const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CategorySchema =  new Schema({
    category_title: {type:String, required:true, maxlength:100},
    category_description: {type:String, required:true}
});

CategorySchema
.virtual("url")
.get(function(){
    return "/store/category/" + this._id;
})

module.exports = mongoose.model("Category", CategorySchema);