const {users} = require("../config/mongoCollections");
const {ObjectId} = require("mongodb");
//const {validUserObject} = require("./fieldValidations");
const {getUserByID} = require("./users");

async function addSong(userId, songName, artistName, dislikeFlag) {
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

    if(!songName) {
        throw "Song name not provided";
    }
    if(typeof songName != "string") {
        throw "Song's name is not a string";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    let trimmedSong = songName.trim();
    let trimmedArtist = artistName.trim();

    if(!trimmedSong) {
        throw "Song name cannot be whitespace";
    }
    if(!trimmedArtist) {
        throw "Artist name cannot be whitespace";
    }

    if(typeof dislikeFlag != "boolean") {
        throw "If provided, dislike flag should be a boolean";
    }
    
    let user = await getUserByID(userId);
    let currentSongList = user.favorites.songs;
    let songFound = false;
    for(let i = 0; i < currentSongList.length; i++) { //Alter song liking if it's already present
        if(trimmedSong == currentSongList[i].songName && trimmedArtist == currentSongList[i].artistName) {
            user.favorites.songs[i].disliked = dislikeFlag;
            songFound = true;
            break;
        }
    }

    if(!songFound) {
        user.favorites.songs.push({songName: trimmedSong, artistName: trimmedArtist, disliked: dislikeFlag});
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: ObjID}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not add the song to the user's list";
    }
    
    //return user;
    return {ok: "Song successfully added"};
}

async function removeSong(userId, songName, artistName) {
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

    if(!songName) {
        throw "Song's name not provided";
    }
    if(typeof songName != "string") {
        throw "Song's name is not a string";
    }

    if(!artistName) {
        throw "Artist's name not provided";
    }
    if(typeof artistName != "string") {
        throw "Artist's name is not a string";
    }

    let trimmedSong = songName.trim();
    let trimmedArtist = artistName.trim();

    if(!trimmedSong) {
        throw "Song name cannot be whitespace";
    }
    if(!trimmedArtist) {
        throw "Artist name cannot be whitespace";
    }

    if(typeof dislikeFlag != "boolean") {
        throw "If provided, dislike flag should be a boolean";
    }

    let user = await getUserByID(userId);
    let currentSongList = user.favorites.songs;
    let songFound = false;
    for(let i = 0; i < currentSongList.length; i++) { //Make sure song is in the list already
        if(trimmedSong == currentSongList[i].songName && trimmedArtist == currentSongList[i].artistName) { 
            songFound = true;
            user.favorites.songs.splice(i, 1);
            break;
        }
    }
    if(!songFound) {
        throw "Song not found in list";
    }

    const userCollection = await users();
    const updateStatus = await userCollection.updateOne({_id: ObjID}, {$set: user})
    if(updateStatus.modifiedCount === 0) {
        throw "Could not remove the song to the user's list";
    }
    
    //return user;
}

module.exports = {addSong, removeSong};