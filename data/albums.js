const {users} = require("../config/mongoCollections");
//const {ObjectId} = require("mongodb");
const {validUserObject} = require("./fieldValidations");
//const {getUserById} = ("./users");

async function addAlbum(user, albumName, artistName, rating) {
    if(!user) {
        throw "User not provided";
    }
    if(typeof user != "object" || Array.isArray(user)) {
        throw "User is not an object";
    }
    if(!validUserObject(user)) {
        throw "Object provided is not a valid user object";
    }

    if(!albumName) {
        throw "Album name not provided";
    }
    if(typeof albumName != "string") {
        throw "Album's name is not a string";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    if(!rating) {
        throw "Album rating not provided";
    }
    if(typeof rating != "number") {
        throw "Album rating is not a number";
    }
    if(rating < 1 || rating > 10) {
        throw "Album rating must be in between 1 and 10";
    }
    
    let currentAlbumList = user.favorites.albums;
    for(let i = 0; i < currentAlbumList.length; i++) { //Make sure album isn't in the list already
        if(albumName == currentAlbumList[i].albumName && artistName == currentAlbumList[i].artistName) {
            throw "This album is already on your list."
        }
    }

    user.favorites.albums.push({albumName: albumName, artistName: artistName, rating: rating});

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: user._id}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not add the album to the user's list";
    }
    
    return user;
}

async function removeAlbum(user, albumName, artistName) {
    if(!user) {
        throw "User not provided";
    }
    if(typeof user != "object" || Array.isArray(user)) {
        throw "User is not an object";
    }
    if(!validUserObject(user)) {
        throw "Object provided is not a valid user object";
    }

    if(!albumName) {
        throw "Album's name not provided";
    }
    if(typeof albumName != "string") {
        throw "Album's name is not a string";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    let currentAlbumList = user.favorites.albums;
    let albumFound = false;
    for(let i = 0; i < currentAlbumList.length; i++) { //Make sure album is in the list already
        if(albumName == currentAlbumList[i].albumName && artistName == currentAlbumList[i].artistName) { 
            albumFound = true;
            user.favorites.albums.splice(i, 1);
            break;
        }
    }
    if(!albumFound) {
        throw "Album not found in list";
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: user._id}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not remove the album to the user's list";
    }
    
    return user;
}

module.exports = {addAlbum, removeAlbum};