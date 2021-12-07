const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ItemSchema =  new Schema({
    item_name: {type:String, required:true, maxlength:100},
    item_price: {type:Number, required: true, max:1000},
    item_stock: {type:Number, required:true, max:50},
    category:{type:Schema.Types.ObjectId, ref : "Category", required:true}
});

ItemSchema
.virtual("url")
.get(function(){
    return "/store/item/" + this._id;
})

module.exports = mongoose.model("Item", ItemSchema);