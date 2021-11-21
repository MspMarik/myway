const {users} = require("../config/mongoCollections");
const {ObjectId} = require("mongodb");
const {validUserObject} = ("./fieldValidations");
//const {getUserById} = ("./users");

async function addArtist(user, artistName, dislikeFlag=false) {
    if(!user) {
        throw "User not provided";
    }
    if(typeof user != "object" || Array.isArray(user)) {
        throw "User is not an object";
    }
    if(!validUserObject(user)) {
        throw "Object provided is not a valid user object";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    if(typeof dislikeFlag != "boolean") {
        throw "If provided, dislike flag should be a boolean";
    }
    
    let currentArtistList = user.favorites.artists;
    for(let i = 0; i < currentArtistList.length; i++) { //Make sure artist isn't in the list already
        if(artistName == currentArtistList[i].artistName) { //TODO: If the user wants to change artist to liked or disliked, still throw, or just take alternate action?
            throw "This artist is already on your list."
        }
    }

    user.favorites.artists.push({artistName: artistName, disliked: dislikeFlag});

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: user._id}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not add the artist to the user's list";
    }
    
    return user;
}

async function removeArtist(user, artistName) {
    if(!user) {
        throw "User not provided";
    }
    if(typeof user != "object" || Array.isArray(user)) {
        throw "User is not an object";
    }
    if(!validUserObject(user)) {
        throw "Object provided is not a valid user object";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    let currentArtistList = user.favorites.artists;
    let artistFound = false;
    for(let i = 0; i < currentArtistList.length; i++) { //Make sure artist is in the list already
        if(artistName == currentArtistList[i].artistName) { 
            artistFound = true;
            user.favorites.artists.splice(i, 1);
            break;
        }
    }
    if(!artistFound) {
        throw "Artist not found in list";
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: user._id}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not remove the artist to the user's list";
    }
    
    return user;
}

module.exports = {addArtist, removeArtist};