const { users } = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
//const {validUserObject} = require("./fieldValidations");
const { getUserByID } = require("./users");

<<<<<<< HEAD
async function addArtist(userId, artistName, dislikeFlag = false) {
    if (!userId) {
=======
async function addArtist(userId, artistName, dislikeFlag=false) {
    if(!userId) {
>>>>>>> c65feffed5a32fc970c63c62e8e433292d93f266
        throw "User ID not provided";
    }
    if (typeof userId != "string") {
        throw "User ID must be a string";
    }
    if (userId.trim().length <= 0) {
        throw "User ID is whitespace";
    }

    ObjID = ObjectId(userId);

    if (!artistName) {
        throw "Artist's name not provided";
    }
    if (typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

<<<<<<< HEAD
    if (typeof dislikeFlag != "boolean") {
=======
    let trimmedArtist = artistName.trim();
    if(!trimmedArtist) {
        throw "Artist name cannot be whitespace";
    }

    if(typeof dislikeFlag != "boolean") {
>>>>>>> c65feffed5a32fc970c63c62e8e433292d93f266
        throw "If provided, dislike flag should be a boolean";
    }

    let user = await getUserByID(userId);
    let currentArtistList = user.favorites.artists;
    let artistFound = false;
<<<<<<< HEAD
    for (let i = 0; i < currentArtistList.length; i++) {
        //Alter album liking if it's already present
        if (artistName == currentArtistList[i].artistName) {
=======
    for(let i = 0; i < currentArtistList.length; i++) { //Alter album liking if it's already present
        if(trimmedArtist == currentArtistList[i].artistName) {
>>>>>>> c65feffed5a32fc970c63c62e8e433292d93f266
            user.favorites.artists[i].disliked = dislikeFlag;
            artistFound = true;
            break;
        }
    }

    if (!artistFound) {
        user.favorites.artists.push({ artistName: artistName, disliked: dislikeFlag });
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({ _id: ObjID }, { $set: user });
    if (updateStatus.modifiedCount === 0) {
        throw "Could not add the artist to the user's list";
    }

    //return user;
    return { ok: "Artist successfully added" };
}

async function removeArtist(userId, artistName) {
    if (!userId) {
        throw "User ID not provided";
    }
    if (typeof userId != "string") {
        throw "User ID must be a string";
    }
    if (userId.trim().length <= 0) {
        throw "User ID is whitespace";
    }

    ObjID = ObjectId(userId);

    if (!artistName) {
        throw "Artist's name not provided";
    }
    if (typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    let trimmedArtist = artistName.trim();
    if(!trimmedArtist) {
        throw "Artist name cannot be whitespace";
    }

    let user = await getUserByID(userId);
    let currentArtistList = user.favorites.artists;
    let artistFound = false;
<<<<<<< HEAD
    for (let i = 0; i < currentArtistList.length; i++) {
        //Make sure artist is in the list already
        if (artistName == currentArtistList[i].artistName) {
=======
    for(let i = 0; i < currentArtistList.length; i++) { //Make sure artist is in the list already
        if(trimmedArtist == currentArtistList[i].artistName) { 
>>>>>>> c65feffed5a32fc970c63c62e8e433292d93f266
            artistFound = true;
            user.favorites.artists.splice(i, 1);
            break;
        }
    }
    if (!artistFound) {
        throw "Artist not found in list";
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({ _id: ObjID }, { $set: user });
    if (updateStatus.modifiedCount === 0) {
        throw "Could not remove the artist to the user's list";
    }

    //return user;
    return {ok: 'Artist successfully removed'}
}

module.exports = { addArtist, removeArtist };
