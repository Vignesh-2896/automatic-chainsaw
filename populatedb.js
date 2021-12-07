#! /usr/bin/env node

console.log('This script populates some categories and their items.')

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')


var Category = require("./models/category")
var Item = require("./models/item")

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = []

function categoryCreate(category_title, category_description, cb){
  var categoryDetail = {category_title: category_title, category_description: category_description};
  var category = new Category(categoryDetail);

  category.save(function(err){
    if(err){
      cb(err, null);
      return
    }
    console.log("New Category : " + category);
    categories.push(category);
    cb(null, category)
  })

}

function itemCreate(item_name, item_price, item_stock, category, cb){
  var itemDetail = {
    item_name: item_name,
    item_price: item_price,
    item_stock: item_stock,
    category: category
  }
  var item = new Item(itemDetail);

  item.save(function(err){
    if(err){
      cb(err, null);
      return
    }
    console.log("New Item : " + item);
    items.push(item);
    cb(null, item);
  });
}


function createCategories(cb){
  async.parallel([
    function(callback){
      categoryCreate("Posters", "High definition posters of A3 size on 300GSM paper.", callback)
    },
    function(callback){
      categoryCreate("T-Shirts", "Printed T-Shirts of your favorite anime characters and quotes.", callback)
    },
    function(callback){
      categoryCreate("Figurines", "Miniature action figures with realistic design.", callback)
    },
    
  ],
  cb)
}


function createItems(cb){
  async.parallel([
    function(callback){
      itemCreate("Attack on Titan Season 4", 250, 20, categories[0], callback)
    },
    function(callback){
      itemCreate("Haikyuu - Hinata - Karauno", 250, 20, categories[0], callback)
    },
    function(callback){
      itemCreate("Kimi No Na Wa", 250, 20, categories[0], callback)
    },
    function(callback){
      itemCreate("My Hero Academia - Izuku", 250, 20, categories[0], callback)
    },
    function(callback){
      itemCreate("DragonBall Z - Goku Kamehameha", 350, 10, categories[1], callback)
    },
    function(callback){
      itemCreate("Attack on Titan - Levi", 350, 10, categories[1], callback)
    },
    function(callback){
      itemCreate("Naruto - Mangekyou Sharingan", 350, 10, categories[1], callback)
    },
    function(callback){
      itemCreate("Alphonse Elric", 950, 10, categories[2], callback)
    },
    function(callback){
      itemCreate("All Might", 950, 10, categories[2], callback)
    },
    function(callback){
      itemCreate("Sleeping Zenitsu", 950, 10, categories[2], callback)
    },
  ],
  cb)
}

async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



