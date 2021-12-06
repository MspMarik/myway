const express = require("express");
const router = express.Router();
const xss = require("xss");
const userFunctions = require("../data/users");
const lastfmFunctions = require("../data/lastfm");
const {validUsername, validPassword} = require("../data/fieldValidations");

//Fetch login page
router.get("/", async (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render logout page.
    // if(request.session.userId) {
    //     response.redirect("/myprofile") //INC: Route for the profile page
    // }
    // else {
    //     response.render("pages/login", {}) //INC: Path to login page, remember to include handlebar fields
    // }

    response.render("pages/index", {});
});

//Post to login page
router.post("/", async (request, response) => {
    try {
        //First, see if the user is already logged in. If so, redirect to user's profile page 
        if(request.session.userId) {
            response.redirect("/myprofile"); //INC: Route for the profile page
        }
        else {
            //Then, check that login credentials are provided and of proper format
            //Username Checking
            if(!request.body.username) {
                console.log('error');
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
            let userId = await userFunctions.loginUser(cleanedUsername, cleanedPassword);

            request.session.userId = userId;
            response.redirect("/profile");
        }
    }
    catch(err) {
        //Finally, if the credentials are not valid, render the signup page again, this time with an error
        response.render("pages/login", {errorStr: err.message}) //INC: Rerenders signup with error (might do AJAX stuff later)
    }
});

//Fetch signup page 
router.get("/signup", async (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render signup page.
    if(request.session.userId) {
        response.redirect("/myprofile") //INC: Route for the profile page
    }
    else {
        response.render("pages/signup", {}) //INC: Path to signup, remember to include handlebar fields
    }
});

//Post to signup page
router.post("/signup", async (request, response) => {
    //console.log('where do we go now?');
    //First, see if the user is already logged in. If so, redirect to user's profile page 
    //Then, check that signup credentials are provided and of proper format
    //Next, check to see if the username provided is already taken. If they are, render the signup page again, this time with an error
    //Finally, if the credentials are valid, redirect to the user's profile page
    try {
        //First, see if the user is already logged in. If so, redirect to user's profile page 
        if(request.session.userId) {
            response.redirect("/"); //INC: Route for the profile page
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
            if(!request.body.password) {
                throw "Password not provided";
            }
            if(typeof request.body.password != "string") {
                throw "Password must be a string";
            }

            if(!request.body.password2) {
                throw "You must retype your password";
            }
            if(request.body.password2 != request.body.password) {
                throw "You must provide the same initial password";
            }



            let cleanedUsername = xss(request.body.username.trim().toLowerCase());
            let cleanedPassword = xss(request.body.password.trim());

            //Next, check to see if the login credentials are valid. If they are, redirect to the user's profile page
            let userId = await userFunctions.createUser(cleanedUsername, cleanedPassword);

            request.session.userId = userId;
            response.redirect("/");
        }
    }
    catch(err) {
        //Finally, if the credentials are not valid, render the login page again, this time with an error
        response.render("pages/signup", {errorStr: err}) //INC: Rerenders login with error (might do AJAX stuff later)
    }
    
});

//Main search page
router.get("/search", async (request, response) => {
   if(!request.session.userId) {
       response.redirect("/");
   }
   else {
       response.render("pages/chooseWhatToSearch");
   }
});

//Specific search pages
router.get("/search/artists", async (request, response) => {
    if(!request.session.userId) {
        response.redirect("/");
    }
    else {
        response.render("pages/search", {artist: true});
    }
 });

 //Fetch search results for artists
 router.post("/search/artists", async (request, response) => {
    try {
        if(!request.session.userId) {
            response.redirect("/");
        }
        else {
            //Search Term Checking
            if(!request.body.searchbox) {
                throw "Search term not provided";
            }
            if(typeof request.body.searchbox != "string") {
                throw "Search term must be a string";
            }

            let cleanedSearchTerm = xss(request.body.searchbox.trim());
            let cleanedTag;
            
            //Tag Checking
            if(request.body.tag) {
                if(typeof userTag != string || !userTag.trim()) {
                    throw "If provided, search tag must be in the form of a non-whitespace string";
                }
                else {
                    cleanedTag = xss(request.body.tag.trim())
                }
            }

            let retrievedArtists = await lastfmFunctions.getArtistsByTextInput(cleanedSearchTerm, cleanedTag);
            let empty = false;
            if(retrievedArtists.length == 0) {
                empty = true;
            }

            response.render("pages/search", {artist: true, searchResults: retrievedArtists, error: empty});
        }
    }
    catch(err) { //TODO: Figure out how errors should be displayed on this page
        response.render("pages/search", {artist: true, searchResults: [], error: true});
    }
 });

 router.get("/search/songs", async (request, response) => {
    if(!request.session.userId) {
        response.redirect("/");
    }
    else {
        response.render("pages/search", {song: true});
    }
 });

  //Fetch search results for songs
  router.post("/search/songs", async (request, response) => {
    try {
        if(!request.session.userId) {
            response.redirect("/");
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
            let cleanedTag;
            
            //Tag Checking
            if(request.body.tag) {
                if(typeof userTag != string || !userTag.trim()) {
                    throw "If provided, search tag must be in the form of a non-whitespace string";
                }
                else {
                    cleanedTag = xss(request.body.tag.trim())
                }
            }

            let retrievedSongs = await lastfmFunctions.getSongsByTextInput(cleanedSearchTerm, cleanedTag);
            let empty = false;
            if(retrievedSongs.length == 0) {
                empty = true;
            }

            response.render("pages/search", {song: true, searchResults: retrievedSongs, error: empty});
        }
    }
    catch(err) { //TODO: Figure out how errors should be displayed on this page
        response.render("pages/search", {song: true, searchResults: [], error: true});
    }
 });

 router.get("/search/albums", async (request, response) => {
    if(!request.session.userId) {
        response.redirect("/");
    }
    else {
        response.render("pages/search", {album: true});
    }
 });

  //Fetch search results for albums
  router.post("/search/albums", async (request, response) => {
    try {
        if(!request.session.userId) {
            response.redirect("/");
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
            let cleanedTag;
            
            //Tag Checking
            if(request.body.tag) {
                if(typeof userTag != string || !userTag.trim()) {
                    throw "If provided, search tag must be in the form of a non-whitespace string";
                }
                else {
                    cleanedTag = xss(request.body.tag.trim())
                }
            }

            let retrievedAlbums = await lastfmFunctions.getAlbumsByTextInput(cleanedSearchTerm, cleanedTags);
            let empty = false;
            if(retrievedAlbums.length == 0) {
                empty = true;
            }

            response.render("pages/search", {album: true, searchResults: retrievedAlbums, error: empty});
        }
    }
    catch(err) { //TODO: Figure out how errors should be displayed on this page
        response.render("pages/search", {album: true, searchResults: [], error: true});
    }
 });



//Logout of the website
router.get("/logout", async (request, response) => {
    //Check if the user is logged in. If so, redirect to "main page" with a succesful logout message. Else redirect to "main page" without said message
    if(request.session.userId) {
        request.session.destroy();
        response.render("pages/login", {logoutMsg: "Logged out"});
    }
    else {
        response.redirect("/");
    }
});

//editRanking page for users of webstie
router.get("/editRanking", async (request, response) => {
    if(!request.session.userId) {
        response.redirect("/");
    }else{
        response.render("pages/", {album: true});
    }

});

router.post("/editRanking", async (request, response) => {
    if(!request.session.userId) {
        response.redirect("/");
    }else{
        
    }

});

    

const constructorMethod = (app) => {
    app.use('/', router);
  
    app.use('*', (request, response) => {
      response.status(404).render("pages/404");
    });
};
  
  module.exports = constructorMethod;