const express = require("express");
const router = express.Router();
const xss = require("xss");
const path = require("path");
const songsFunctions = require("../data/songs");
const albumsFunctions = require("../data/albums");
const artistsFunctions = require("../data/artists");
const userFunctions = require("../data/users");
const lastfmFunctions = require("../data/lastfm");
const metricsFunctions = require("../data/metrics");
const { validUsername, validPassword } = require("../data/fieldValidations");

//Fetch main pa
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
router.get("/loginlogout", async (request, response) => {
    if (request.session.userId) {
        request.session.destroy();
        response.redirect("/");
    } else {
        response.render("pages/login", {});
    }
});
//Post to login page
router.post("/loginlogout", async (request, response) => {
    try {
        //First, see if the user is already logged in. If so, redirect to user's profile page
        if (request.session.userId) {
            response.redirect("/");
        } else {
            //Then, check that login credentials are provided and of proper format
            //Username Checking
            if (!request.body.username) {
                //console.log('error');
                throw "Username not provided";
            }
            if (typeof request.body.username != "string") {
                throw "Username must be a string";
            }
            let cleanedUsername = xss(request.body.username.trim().toLowerCase());
            if (!validUsername(cleanedUsername)) {
                throw "Username must be at least four characters long, and only contain letters and numbers.";
            }

            //Password Checking
            if (!request.body.password) {
                throw "Password not provided";
            }
            if (typeof request.body.password != "string") {
                throw "Password must be a string";
            }
            let cleanedPassword = xss(request.body.password.trim());
            if (!validPassword(cleanedPassword)) {
                throw "Password must be at least six characters long, and not contain any spaces.";
            }

            //Next, check to see if the signup credentials are valid. If they are, redirect to the user's profile page
            try {
                let userId = await userFunctions.loginUser(cleanedUsername, cleanedPassword);
                //console.log(userId);
                request.session.userId = userId;
                response.redirect("/");
            } catch (err) {
                response.render("pages/login", { errorStr: err });
            }
        }
    } catch (err) {
        //Finally, if the credentials are not valid, render the signup page again, this time with an error
        response.render("pages/login", { errorStr: err }); //INC: Rerenders signup with error (might do AJAX stuff later)
    }
});

//Fetch signup page
router.get("/signup", async (request, response) => {
    //Check if the user is logged in. If so, redirect to profile page. Else render signup page.
    if (request.session.userId) {
        response.redirect("/");
    } else {
        response.render("pages/signup", {}); //INC: Path to signup, remember to include handlebar fields
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
        if (request.session.userId) {
            response.redirect("/");
        } else {
            //Then, check that signup credentials are provided and of proper format
            //Username Checking
            if (!request.body.username) {
                throw "Username not provided";
            }
            if (typeof request.body.username != "string") {
                throw "Username must be a string";
            }

            //Password Checking
            if (!request.body.password) {
                throw "Password not provided";
            }
            if (typeof request.body.password != "string") {
                throw "Password must be a string";
            }

            if (!request.body.password2) {
                throw "You must retype your password";
            }
            if (request.body.password2 != request.body.password) {
                throw "You must provide the same initial password";
            }

            let cleanedUsername = xss(request.body.username.trim().toLowerCase());
            let cleanedPassword = xss(request.body.password.trim());

            //Next, check to see if the login credentials are valid. If they are, redirect to the user's profile page
            let userId = await userFunctions.createUser(cleanedUsername, cleanedPassword);

            request.session.userId = userId;
            response.redirect("/");
        }
    } catch (err) {
        //Finally, if the credentials are not valid, render the login page again, this time with an error
        response.render("pages/signup", { errorStr: err }); //INC: Rerenders login with error (might do AJAX stuff later)
    }
});

//Main search page
router.get("/search", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/chooseWhatToSearch");
    }
});

//Specific search pages
router.get("/search/artists", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/search", { artist: true });
    }
});

//Fetch search results for artists
router.post("/search/artists", async (request, response) => {
    try {
        if (!request.session.userId) {
            response.redirect("/loginlogout");
        } else {
            //Search Term Checking
            if (!request.body.searchbox) {
                throw "Search term not provided";
            }
            if (typeof request.body.searchbox != "string") {
                throw "Search term must be a string";
            }

            let cleanedSearchTerm = xss(request.body.searchbox.trim());
            let cleanedTag;

            //Tag Checking
            if (request.body.tag) {
                if (typeof userTag != string || !userTag.trim()) {
                    throw "If provided, search tag must be in the form of a non-whitespace string";
                } else {
                    cleanedTag = xss(request.body.tag.trim());
                }
            }

            let retrievedArtists = await lastfmFunctions.getArtistsByTextInput(cleanedSearchTerm, cleanedTag);
            let empty = false;
            if (retrievedArtists.length == 0) {
                empty = true;
            }
            for(let i = 0; i < retrievedArtists.length; i++){
                retrievedArtists[i].art = true;
            }

            response.render("pages/search", { artist: true, searchResults: retrievedArtists, error: empty });
        }
    } catch (err) {
        //TODO: Figure out how errors should be displayed on this page
        response.render("pages/search", { artist: true, searchResults: [], error: true });
    }
});

router.get("/search/songs", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/search", { song: true });
    }
});

//Fetch search results for songs
router.post("/search/songs", async (request, response) => {
    try {
        if (!request.session.userId) {
            response.redirect("/loginlogout");
        } else {
            //Search Term Checking
            if (!request.body.searchbox) {
                throw "Search term not provided";
            }
            if (typeof request.body.searchbox != "string") {
                throw "Search term must be a string";
            }

            let cleanedSearchTerm = xss(request.body.searchbox);
            let cleanedTag;

            //Tag Checking
            if (request.body.tag) {
                if (typeof userTag != "string" || !userTag.trim()) {
                    throw "If provided, search tag must be in the form of a non-whitespace string";
                } else {
                    cleanedTag = xss(request.body.tag.trim());
                }
            }
            let yep = false;
            let cleanedYear
            if(request.body.prodYear){
                cleanedYear = request.body.prodYear;
                yep = true;
            }
            let retrievedSongs = await lastfmFunctions.getSongsByTextInput(cleanedSearchTerm, cleanedTag);
            let empty = false;
            if (retrievedSongs.length == 0) {
                empty = true;
            };

            for(let i = 0; i < retrievedSongs.length; i++){
                let year = await lastfmFunctions.getSongInfo(retrievedSongs[i].name, retrievedSongs[i].artist);
                if(yep){
                    if(Number.parseInt(cleanedYear) == year){
                        retrievedSongs[i].release = year;
                        retrievedSongs[i].song = true;
                    }else{
                        retrievedSongs.splice(i,1);
                        i--;
                    }
                }else{
                    retrievedSongs[i].release = year;
                    retrievedSongs[i].song = true;
                }
            }

            response.render("pages/search", { song: true, searchResults: retrievedSongs, error: empty });
        }
    } catch (err) {
        //TODO: Figure out how errors should be displayed on this page
        response.render("pages/search", { song: true, searchResults: [], error: err });
    }
});

router.get("/search/albums", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/search", { album: true });
    }
});

//Fetch search results for albums
router.post("/search/albums", async (request, response) => {
    try {
        if (!request.session.userId) {
            response.redirect("/loginlogout");
        } else {
            //Search Term Checkint
            if (!request.body.searchbox) {
                throw "Search term not provided";
            }
            if (typeof request.body.searchbox != "string") {
                throw "Search term must be a string";
            }

            let cleanedSearchTerm = xss(request.body.searchbox);
            let cleanedTag;

            //Tag Checking
            if (request.body.tag) {
                if (typeof userTag != string || !userTag.trim()) {
                    throw "If provided, search tag must be in the form of a non-whitespace string";
                } else {
                    cleanedTag = xss(request.body.tag.trim());
                }
            }

            let yep = false;
            let cleanedYear;
            if(request.body.prodYear){
                cleanedYear = request.body.prodYear;
                yep = true;
            }

            let retrievedAlbums = await lastfmFunctions.getAlbumsByTextInput(cleanedSearchTerm, cleanedTag);
            let empty = false;
            if (retrievedAlbums.length == 0) {
                empty = true;
            }

             for(let i = 0; i < retrievedAlbums.length; i++){
                 let year;
                 try{
                    year = await lastfmFunctions.getAlbumInfo(retrievedAlbums[i].name, retrievedAlbums[i].artist);
                 }catch(e){
                 }
                 if(yep){
                    if(Number.parseInt(cleanedYear) == year){
                        retrievedAlbums[i].release = year;
                        retrievedAlbums[i].album = true;
                    }else{
                        retrievedAlbums.splice(i,1);
                        i--;
                    }
                }else{
                    retrievedAlbums[i].release = year;
                    retrievedAlbums[i].album = true;
                }
            }
            response.render("pages/search", {album: true, searchResults: retrievedAlbums, error: empty});
        }
    } catch (err) {
        //TODO: Figure out how errors should be displayed on this page
        response.render("pages/search", { album: true, searchResults: [], error: err });
    }
});

router.get("/myprofile", async (request, response) => {
    if(!request.session.userId) {
        response.redirect("/loginlogout");
    }else{
        response.render("pages/myprofile", {});
    }
});

//Logout of the website
router.get("/logout", async (request, response) => {
    //Check if the user is logged in. If so, redirect to "main page" with a succesful logout message. Else redirect to "main page" without said message
    if (request.session.userId) {
        request.session.destroy();
        response.render("pages/login", { logoutMsg: "Logged out" });
    } else {
        response.redirect("/");
    }
});

//editRanking page for users of webstie
router.get("/editRanking", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/editRanking", { album: true });
    }
});

router.post("/editRanking", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
    }
});

router.get("/ye", async (request, response) => {
    response.sendFile(path.resolve("static/ye.html"));
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
    }
});

router.get("/myprofile", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/myprofile", {});
    }
});

router.get("/mysongs", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/mypage", { song: "Example" });
    }
});

router.get("/myalbums", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/mypage", { album: "Example" });
    }
});

router.get("/myartists", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/mypage", { artist: "Example" });
    }
});

router.get("/shuffle", async (request, response) => {
    if (!request.session.userId) {
        response.redirect("/loginlogout");
    } else {
        response.render("pages/shuffle", {});
    }
});
router.post("/search/addSong", async (request, response) => {
    if (!request.session.userId) {
       //do nothing?
    } else {
        let cleanSongName = request.body.songName;
        let cleanArtistName = request.body.artistName;
        let addData = await songsFunctions.addSong(request.session.userId,cleanSongName, cleanArtistName);
        if(addData.ok){
            console.log(addData.ok);
        }else{
            console.log("something is amuck");
        }
    }
});

router.post("/search/addAlbum", async (request, response) => {
    if (!request.session.userId) {
       //do nothing?
    } else {
        let cleanAlbumName = request.body.albumName;
        let cleanArtistName = request.body.artistName;
        let addData = await albumsFunctions.addAlbum(request.session.userId,cleanAlbumName, cleanArtistName);
        if(addData.ok){
            console.log(addData.ok);
        }else{
            console.log("something is amuck");
        }
    }
});

router.post("/search/addArtist", async (request, response) => {
    if (!request.session.userId) {
       //do nothing?
    } else {
        let cleanArtistName = request.body.artistName;
        let addData = await artistsFunctions.addArtist(request.session.userId, cleanArtistName);
        if(addData.ok){
            console.log(addData.ok);
        }else{
            console.log("something is amuck");
        }
    }
});

router.get("/myrecommendedartists", async (request, response) => {
    if(!request.session.userId) {
        response.redirect("/loginlogout");
    }
    else {
        let recs;
        if(!request.session.cachedRecommendations) { //Getting recommendations is pretty expensive, so cache it once per session
            recs = await metricsFunctions.getRecommendations(request.session.userId);
            request.session.cachedRecommendations = recs;
        }
        else {
            recs = request.session.cachedRecommendations;
        }
        response.render("pages/myrec", {recommendations: recs})
    }
});

const constructorMethod = (app) => {
    app.use("/", router);

    app.use("*", (request, response) => {
        response.status(404).render("pages/404");
    });
};

module.exports = constructorMethod;
