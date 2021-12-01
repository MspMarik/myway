//NOTE: These functions currently rely on the entire user object being passed. Remember this if that is ever changed to something like an id


const userFunctions = require("../../data/users");
const artistFunctions = require("../../data/artists");
const albumFunctions = require("../../data/albums");
const songFunctions = require("../../data/songs");

async function main() {
    //Add a first user
    let userOne;

    try {
        userOne = await userFunctions.createUser("WalkerBove", "password");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an artist
    try {
        userOne = await artistFunctions.addArtist(userOne, "Joe Somebody", false);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an artist already present
    try {
        userOne = await artistFunctions.addArtist(userOne, "Joe Somebody", false);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an artist with bad data
    try {
        userOne = await artistFunctions.addArtist();
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await artistFunctions.addArtist(userOne);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await artistFunctions.addArtist(userOne, 777);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await artistFunctions.addArtist(userOne, "Joe Nobody", "spaghetti");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add a song
    try {
        userOne = await songFunctions.addSong(userOne, "Hello There, I am Joe", "Joe Somebody", false);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add a song already present
    try {
        userOne = await songFunctions.addSong(userOne, "Hello There, I am Joe", "Joe Somebody", false);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add a song with bad data
    try {
        userOne = await songFunctions.addSong();
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await songFunctions.addSong(userOne, ["Song", "Title"]);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await songFunctions.addSong(userOne, "Song Title", true);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await songFunctions.addSong(userOne, "Song Title", "Joe Nobody", 101);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an album
    try {
        userOne = await albumFunctions.addAlbum(userOne, "Joe's Awesome Album", "Joe Somebody", 8);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an album already present
    try {
        userOne = await albumFunctions.addAlbum(userOne, "Joe's Awesome Album", "Joe Somebody", 8);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an album with bad data
    try {
        userOne = await albumFunctions.addAlbum();
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await albumFunctions.addAlbum(userOne, {albumName: "Joe's Awesome Album 2"});
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await albumFunctions.addAlbum(userOne, "Joe's Awesome Album 2", undefined);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        userOne = await albumFunctions.addAlbum(userOne, "Joe's Awesome Album 2", "Joe Somebody", true);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete artist
    try {
        userOne = await artistFunctions.removeArtist(userOne, "Joe Somebody");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete artist that isn't present
    try {
        userOne = await artistFunctions.removeArtist(userOne, "Joe Somebody");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete song
    try {
        userOne = await songFunctions.removeSong(userOne, "Hello There, I am Joe", "Joe Somebody");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete song that isn't present
    try {
        userOne = await songFunctions.removeSong(userOne, "Hello There, I am Joe", "Joe Somebody");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete album
    try {
        userOne = await albumFunctions.removeAlbum(userOne, "Joe's Awesome Album", "Joe Somebody");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete album
    try {
        userOne = await albumFunctions.removeAlbum(userOne, "Joe's Awesome Album", "Joe Somebody");
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete user one
    let deletionMessage;
    try {
        deletionMessage = await userFunctions.deleteUser(userOne);
        console.log(deletionMessage);
    }
    catch(e) {
        console.log(e);
    }

    console.log("All done!");
}

main();