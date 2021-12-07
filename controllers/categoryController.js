var Category = require("../models/category");

exports.site_index = function(req, res){
    res.send("NOT Implemented: SITE HOME PAGE")
}

exports.category_detail = function(req, res){
    res.send("NOT Implemented: CATEGORY Detail PAGE" + req.params.id)
}

exports.category_create_get = function(req, res){
    res.send("NOT Implemented: CATEGORY Create GET PAGE")
}

exports.category_create_post = function(req, res){
    res.send("NOT Implemented: CATEGORY Create POST PAGE")
}

exports.category_delete_get = function(req, res){
    res.send("NOT Implemented: CATEGORY Delete GET PAGE")
}

exports.category_delete_post = function(req, res){
    res.send("NOT Implemented: CATEGORY Delete POST PAGE")
}
exports.category_update_get = function(req, res){
    res.send("NOT Implemented: CATEGORY Update GET PAGE")
}

exports.category_update_post = function(req, res){
    res.send("NOT Implemented: CATEGORY Update POST PAGE")
}

exports.category_list = function(req, res){
    res.send("NOT Implemented: CATEGORY List Page");
}