var express = require("express");
var router = express.Router();

var category = require("../controllers/categoryController");
var item = require("../controllers/itemController");

// CATEGORY routine.
router.get("/",category.site_index); // Homepage of Website

router.get("/category/:categoryID", category.category_detail) // Detailed View of a Category

router.get("/category/:categoryID/create", category.category_create_get) // GET request to create a new Category

router.post("/category/:categoryID/create", category.category_create_post) // POST request to create a new Category

router.get("/category/:categoryID/delete", category.category_create_get) // GET request to delete a Category

router.post("/category/:categoryID/delete", category.category_create_post) // POST request to delete a Category

router.get("/category/:categoryID/update", category.category_create_get) // GET request to update a Category

router.post("/category/:categoryID/update", category.category_create_post) // POST request to update a Category

router.get("/categories", category.category_list) // GET request to fetch all categories.

// ITEM Routing.
router.get("/item/:itemID", item.item_detail) // Detailed View of an Item

router.get("/item/:itemID/create", item.item_create_get) // GET request to create a new Item

router.post("/item/:itemID/create", item.item_create_post) // POST request to create a new Item

router.get("/item/:itemID/delete", item.item_delete_get) // GET request to delete a Item

router.post("/item/:itemID/delete", item.item_delete_post) // POST request to delete a Item

router.get("/item/:itemID/update", item.item_update_get) // GET request to update an Item

router.post("/item/:itemID/update", item.item_update_post) // POST request to update an Item

router.get("/items", item.item_list) // GET request to fetch all items.

module.exports = router;