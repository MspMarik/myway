const {users} = require("../config/mongoCollections");
const {ObjectId} = require("mongodb");
//const {validUserObject} = require("./fieldValidations");
const {getUserByID} = require("./users");

async function addAlbum(userId, albumName, artistName, rating = 0) {
    if(!userId) {
        throw "User ID not provided";
    }
    if(typeof userId != "string") {
        throw "User ID must be a string";
    }
    if(userId.trim().length <= 0) {
        throw "User ID is whitespace";
    }

    ObjID = ObjectId(userId);

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

    if(!rating && rating !== 0) {
        throw "Album rating not provided";
    }
    if(typeof rating != "number") {
        throw "Album rating is not a number";
    }
    if(rating < 0 || rating > 10) {
        throw "Album rating must be in between 0 and 10";
    }
    
    let user = await getUserByID(userId);
    let currentAlbumList = user.favorites.albums;
    let albumFound = false;
    for(let i = 0; i < currentAlbumList.length; i++) { //Alter album rating if it's already present
        if(albumName == currentAlbumList[i].albumName && artistName == currentAlbumList[i].artistName) {
            user.favorites.albums[i].rating = rating;
            albumFound = true;
            break;
        }
    }

    if(!albumFound) {
        user.favorites.albums.push({albumName: albumName, artistName: artistName, rating: rating});
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: ObjID}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not add the album to the user's list";
    }
    
    //return userId;
    return {ok: 'Album successfully added'}
}

async function removeAlbum(userId, albumName, artistName) {
    if(!userId) {
        throw "User ID not provided";
    }
    if(typeof userId != "string") {
        throw "User ID must be a string";
    }
    if(userId.trim().length <= 0) {
        throw "User ID is whitespace";
    }

    ObjID = ObjectId(userId);

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

    let user = await getUserByID(userId);
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
    const updateStatus = await userCollection.updateOne({_id: ObjID}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not remove the album to the user's list";
    }
    
    //return user;
}

module.exports = {addAlbum, removeAlbum};