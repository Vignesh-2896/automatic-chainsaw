# Inventory Application
Based on the popular manga and anime series, Haikyuu!

## Site Map
There are 3 categories in this app - Team, Position and Player. Player is linked to the Team and Position categories. 
There is a navigation bar on top which allow you to access each category and perform CRUD operations.

## Image Handling
Multer was used to handle images for teams and players. Along with other form fields, user can also update the image for
a player/ team.

## Password Authentication
For update and delete operations, user will have to enter a password. 
If password is incorrect, user is brought back to the previous page with no change in DB.
If password is correct, user is redirected accordingly and the DB is updated with required operation.

## Modules Used
1. [Multer](https://www.npmjs.com/package/multer) - Image Handling
2. [Express-Basic-Auth](https://www.npmjs.com/package/express-basic-auth) & [Axios](https://www.npmjs.com/package/axios) - Authentication
3. [Express-Validator](https://express-validator.github.io/docs/) - Validation Forms.
4. [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/)


## Configuration
1. In app.js, set the MongoDB URL.
    ex : 'mongodb+srv://<username>:<password>@<Mongo DB Cluster>/<Your DB>'
2. In routes/haikyuu.js -  function myAuthorizer - set your own password which will be used for authentication.
3. In the three controller files in controllers folder, change Axios Base URL to the one belonging to your website.
    ex: If Localhost -> axios.defaults.baseURL = 'http://localhost:<Your Port>/haikyuu/';
    ex: If Hosted    -> axios.defaults.baseURL = 'http://<Hosted Website Path>/haikyuu/';


[Live Demo](https://lit-ridge-83224.herokuapp.com/)