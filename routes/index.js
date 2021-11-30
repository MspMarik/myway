const express = require("express");
const router = express.Router();
const xss = require("xss");
const userFunctions = require("../data/users");
const {validUsername, validPassword} = require("../data/fieldValidations");

//Get homepage
router.get("/", (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else redirect to "main page" with login and signup links
    if(request.session.user) {
        response.redirect("/profile") //INC: Potential profile route
    }
    else {
        response.render("path_to_home_page", {}) //INC: Path to home page, remember to include handlebar fields
    }
});

//Fetch login page
router.get("/login", (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render logout page.
    if(request.session.user) {
        response.redirect("/profile") //INC: Potential profile route
    }
    else {
        response.render("path_to_login_page", {}) //INC: Path to login page, remember to include handlebar fields
    }
});

//Post to login page
router.post("/login", (request, response) => {
    try {
        //First, see if the user is already logged in. If so, redirect to user's profile page 
        if(request.session.user) {
            response.redirect("/profile"); //INC: Potential profile route
        }
        else {
            //Then, check that login credentials are provided and of proper format
            //Username Checking
            if(!request.body.username) {
                throw "Username not provided";
            }
            if(typeof request.body.username != "string") {
                throw "Username must be a string";
            }
            let cleanedUsername = xss(request.body.username.trim().toLowercase());
            if(!validUsername(cleanedUsername)) {
                throw "Username must be at least four characters long, and only contain letters and numbers.";
            }
            
            //Password Checking
            if(!password) {
                throw "Password not provided";
            }
            if(typeof password != "string") {
                throw "Password must be a string";
            }
            let cleanedPassword = xss(request.body.password.trim());
            if(!validPassword(cleanedPassword)) {
                throw "Password must be at least six characters long, and not contain any spaces.";
            }

            //Next, check to see if the signup credentials are valid. If they are, redirect to the user's profile page
            let newUser = await userFunctions.loginUser(cleanedUsername, cleanedPassword);

            request.session.user = newUser;
            response.redirect("/profile"); //INC: Profile path
        }
    }
    catch(err) {
        //Finally, if the credentials are not valid, render the signup page again, this time with an error
        response.render("path_to_login_page", {errorStr: err.message}) //INC: Rerenders signup with error (might do AJAX stuff later)
    }
});

//Fetch signup page 
router.get("/signup", (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render signup page.
    if(request.user.session) {
        response.redirect("/profile") //INC: Potential profile route
    }
    else {
        response.render("path_to_signup_page", {}) //INC: Path to signup, remember to include handlebar fields
    }
});

//Post to signup page
router.post("/signup", (request, response) => {
    //First, see if the user is already logged in. If so, redirect to user's profile page 
    //Then, check that signup credentials are provided and of proper format
    //Next, check to see if the username provided is already taken. If they are, render the signup page again, this time with an error
    //Finally, if the credentials are valid, redirect to the user's profile page
    try {
        //First, see if the user is already logged in. If so, redirect to user's profile page 
        if(request.session.user) {
            response.redirect("/profile"); //INC: Potential profile route
        }
        else {
            //Then, check that signup credentials are provided and of proper format
            //Username Checking
            if(!request.body.username) {
                throw "Username not provided";
            }
            if(typeof request.body.username != "string") {
                throw "Username must be a string";
            }
            
            //Password Checking
            if(!password) {
                throw "Password not provided";
            }
            if(typeof password != "string") {
                throw "Password must be a string";
            }

            let cleanedUsername = xss(request.body.username.trim().toLowercase());
            let cleanedPassword = xss(request.body.password.trim());

            //Next, check to see if the login credentials are valid. If they are, redirect to the user's profile page
            let fetchedUser = await userFunctions.createUser(cleanedUsername, cleanedPassword);

            request.session.user = fetchedUser;
            response.redirect("/profile"); //INC: Profile path
        }
    }
    catch(err) {
        //Finally, if the credentials are not valid, render the login page again, this time with an error
        response.render("path_to_signup_page", {errorStr: err.message}) //INC: Rerenders login with error (might do AJAX stuff later)
    }
    
});

//Main search page
router.get("/search", (request, response) => {
   if(!request.user.session) {
       response.redirect("/login");
   }
   else {
       response.render("path_to_search_type_page");
   }
});

//Specific search pages
router.get("/searchforartists", (request, response) => {
    if(!request.user.session) {
        response.redirect("/login");
    }
    else {
        response.render("path_to_search_page", {artist: true});
    }
 });

 router.get("/searchforsongs", (request, response) => {
    if(!request.user.session) {
        response.redirect("/login");
    }
    else {
        response.render("path_to_search_page", {song: true});
    }
 });

 router.get("/searchforalbums", (request, response) => {
    if(!request.user.session) {
        response.redirect("/login");
    }
    else {
        response.render("path_to_search_page", {album: true});
    }
 });



//Logout of the website
router.get("/logout", (request, response) => {
    //Check if the user is logged in. If so, redirect to "main page" with a succesful logout message. Else redirect to "main page" without said message
    if(request.session.user) {
        request.session.destroy();
        response.render("path_to_home_page", {logoutMsg: "Logged out"});
    }
    else {
        response.render("path_to_home_page", {}); //INC: Path to homepage, remember to include handlebar fields
    }
});

const constructorMethod = (app) => {
    app.use('/', router);
  
    app.use('*', (request, response) => {
      response.redirect("/");
    });
};
  
  module.exports = constructorMethod;