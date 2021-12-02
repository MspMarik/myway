const express = require("express");
const router = express.Router();
const xss = require("xss");
const userFunctions = require("../data/users");
const lastfmFunctions = require("../data/lastfm");
const {validUsername, validPassword} = require("../data/fieldValidations");

//Get homepage
router.get("/", async (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else redirect to "main page" with login and signup links
    if(request.session.user) {
        response.redirect("/profile") //INC: Potential profile route
    }
    else {
        response.render("path_to_home_page", {}) //INC: Path to home page, remember to include handlebar fields
    }
});

//Fetch login page
router.get("/login", async (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render logout page.
    if(request.session.user) {
        response.redirect("/profile") //INC: Potential profile route
    }
    else {
        response.render("path_to_login_page", {}) //INC: Path to login page, remember to include handlebar fields
    }
});

//Post to login page
router.post("/login", async (request, response) => {
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
router.get("/signup", async (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render signup page.
    if(request.user.session) {
        response.redirect("/profile") //INC: Potential profile route
    }
    else {
        response.render("path_to_signup_page", {}) //INC: Path to signup, remember to include handlebar fields
    }
});

//Post to signup page
router.post("/signup", async (request, response) => {
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
router.get("/search", async (request, response) => {
   if(!request.user.session) {
       response.redirect("/login");
   }
   else {
       response.render("path_to_search_type_page");
   }
});

//Specific search pages
router.get("/searchforartists", async (request, response) => {
    if(!request.user.session) {
        response.redirect("/login");
    }
    else {
        response.render("path_to_search_page", {artist: true});
    }
 });

 //Fetch search results for artists
 router.post("/searchforartists", async (request, response) => {
    try {
        if(!request.user.session) {
            response.redirect("/login");
        }
        else {
            //Search Term Checking
            if(!request.body.searchbox) {
                throw "Search term not provided";
            }
            if(typeof request.body.searchbox != "string") {
                throw "Search term must be a string";
            }

            let cleanedSearchTerm = xss(request.body.searchbox);
            let cleanedTags = []
            
            //Tags Checking
            if(request.body.tags) {
                if(!Array.isArray(request.body.tags)) {
                    throw "If provided, search tags must be in the form of an array";
                }
                else {
                    for(let i = 0; i < request.body.tags.length; i++) { //Make sure all tags provided are valid strings
                        if(typeof request.body.tags[i] != "string") { //A string
                            throw "One of the tags provided was not a string";
                        }
                        if(!request.body.tags[i].trim()) { //Not whitespace
                            throw "One of the tags provided was whitespace";
                        }
                    }
                    for(let i = 0; i < request.body.tags.length; i++) { //Sanitize all tags
                        cleanedTags.push(xss(request.body.tags[i].trim()));
                    }
                }
            }

            let retrievedArtists = await lastfmFunctions.getArtistsByTextInput(cleanedSearchTerm, cleanedTags);
            let empty = false;
            if(retrievedArtists.length == 0) {
                empty = true;
            }

            response.render("path_to_search_page", {artist: true, searchResults: retrievedArtists, error: empty});
        }
    }
    catch(err) { //TODO: Figure out how errors should be displayed on this page
        response.render("path_to_search_page", {artist: true, searchResults: [], error: true});
    }
 });

 router.get("/searchforsongs", async (request, response) => {
    if(!request.user.session) {
        response.redirect("/login");
    }
    else {
        response.render("path_to_search_page", {song: true});
    }
 });

  //Fetch search results for songs
  router.post("/searchforsongs", async (request, response) => {
    try {
        if(!request.user.session) {
            response.redirect("/login");
        }
        else {
            //Search Term Checking
            if(!request.body.searchbox) {
                throw "Search term not provided";
            }
            if(typeof request.body.searchbox != "string") {
                throw "Search term must be a string";
            }

            let cleanedSearchTerm = xss(request.body.searchbox);
            let cleanedTags = []
            
            //Tags Checking
            if(request.body.tags) {
                if(!Array.isArray(request.body.tags)) {
                    throw "If provided, search tags must be in the form of an array";
                }
                else {
                    for(let i = 0; i < request.body.tags.length; i++) { //Make sure all tags provided are valid strings
                        if(typeof request.body.tags[i] != "string") { //A string
                            throw "One of the tags provided was not a string";
                        }
                        if(!request.body.tags[i].trim()) { //Not whitespace
                            throw "One of the tags provided was whitespace";
                        }
                    }
                    for(let i = 0; i < request.body.tags.length; i++) { //Sanitize all tags
                        cleanedTags.push(xss(request.body.tags[i].trim()));
                    }
                }
            }

            let retrievedSongs = await lastfmFunctions.getSongsByTextInput(cleanedSearchTerm, cleanedTags);
            let empty = false;
            if(retrievedSongs.length == 0) {
                empty = true;
            }

            response.render("path_to_search_page", {song: true, searchResults: retrievedSongs, error: empty});
        }
    }
    catch(err) { //TODO: Figure out how errors should be displayed on this page
        response.render("path_to_search_page", {song: true, searchResults: [], error: true});
    }
 });

 router.get("/searchforalbums", async (request, response) => {
    if(!request.user.session) {
        response.redirect("/login");
    }
    else {
        response.render("path_to_search_page", {album: true});
    }
 });

  //Fetch search results for albums
  router.post("/searchforalbums", async (request, response) => {
    try {
        if(!request.user.session) {
            response.redirect("/login");
        }
        else {
            //Search Term Checkint
            if(!request.body.searchbox) {
                throw "Search term not provided";
            }
            if(typeof request.body.searchbox != "string") {
                throw "Search term must be a string";
            }

            let cleanedSearchTerm = xss(request.body.searchbox);
            let cleanedTags = []
            
            //Tags Checking
            if(request.body.tags) {
                if(!Array.isArray(request.body.tags)) {
                    throw "If provided, search tags must be in the form of an array";
                }
                else {
                    for(let i = 0; i < request.body.tags.length; i++) { //Make sure all tags provided are valid strings
                        if(typeof request.body.tags[i] != "string") { //A string
                            throw "One of the tags provided was not a string";
                        }
                        if(!request.body.tags[i].trim()) { //Not whitespace
                            throw "One of the tags provided was whitespace";
                        }
                    }
                    for(let i = 0; i < request.body.tags.length; i++) { //Sanitize all tags
                        cleanedTags.push(xss(request.body.tags[i].trim()));
                    }
                }
            }

            let retrievedAlbums = await lastfmFunctions.getAlbumsByTextInput(cleanedSearchTerm, cleanedTags);
            let empty = false;
            if(retrievedAlbums.length == 0) {
                empty = true;
            }

            response.render("path_to_search_page", {album: true, searchResults: retrievedAlbums, error: empty});
        }
    }
    catch(err) { //TODO: Figure out how errors should be displayed on this page
        response.render("path_to_search_page", {album: true, searchResults: [], error: true});
    }
 });



//Logout of the website
router.get("/logout", async (request, response) => {
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
      response.status(404).render("path_to_404_page");
    });
};
  
  module.exports = constructorMethod;