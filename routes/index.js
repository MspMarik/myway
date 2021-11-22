const express = require("express");
const router = express.Router();

//Get homepage
router.get("/", (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else redirect to "main page" with login and signup links
});

//Fetch login page
router.get("/login", (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render logout page.
});

//Post to login page
router.post("/login", (request, response) => {
    //First, see if the user is already logged in. If so, redirect to user's profile page 
    //Then, check that login credentials are provided and of proper format
    //Next, check to see if the login credentials are valid. If they are, redirect to the user's profile page
    //Finally, if the credentials are not valid, render the login page again, this time with an error
});

//Fetch signup page 
router.get("/signup", (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render signup page.
});

//Post to signup page
router.get("/signup", (request, response) => {
    //First, see if the user is already logged in. If so, redirect to user's profile page 
    //Then, check that signup credentials are provided and of proper format
    //Next, check to see if the username provided is already taken. If they are, render the signup page again, this time with an error
    //Finally, if the credentials are valid, redirect to the user's profile page
});

//Logout of the website
router.get("/logout", (request, response) => {
    //Check if the user is logged in. If so, redirect to "main page" with a succesful logout message. Else redirect to "main page" without said message
});

const constructorMethod = (app) => {
    app.use('/', router);
  
    app.use('*', (request, response) => {
      response.redirect("/");
    });
};
  
  module.exports = constructorMethod;