const {createUser, getUserByID, deleteUser} = require("../../data/users");
const {addArtist, removeArtist} = require("../../data/artists");
const {addAlbum, removeAlbum} = require("../../data/albums");
const {addSong, removeSong} = require("../../data/songs");

async function main() {
    //Add a first user
    let userOneID;
    let userOne;

    try {
        userOneID = await createUser("WalkerBove", "password");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an artist
    try {
        await addArtist(userOneID, "Joe Somebody", false);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an artist already present
    try {
        await addArtist(userOneID, "Joe Somebody", false);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an artist with bad data
    try {
        await addArtist();
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addArtist(userOneID);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addArtist(userOneID, 777);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addArtist(userOneID, "Joe Nobody", "spaghetti");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add a song
    try {
        await addSong(userOneID, "Hello There, I am Joe", "Joe Somebody", false);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add a song already present
    try {
        await addSong(userOneID, "Hello There, I am Joe", "Joe Somebody", false);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add a song with bad data
    try {
        await addSong();
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addSong(userOneID, ["Song", "Title"]);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addSong(userOneID, "Song Title", true);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addSong(userOneID, "Song Title", "Joe Nobody", 101);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an album
    try {
        await addAlbum(userOneID, "Joe's Awesome Album", "Joe Somebody", 8);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an album already present
    try {
        await addAlbum(userOneID, "Joe's Awesome Album", "Joe Somebody", 8);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Add an album with bad data
    try {
        await addAlbum();
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addAlbum(userOneID, {albumName: "Joe's Awesome Album 2"});
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addAlbum(userOneID, "Joe's Awesome Album 2", undefined);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    try {
        await addAlbum(userOneID, "Joe's Awesome Album 2", "Joe Somebody", true);
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete artist
    try {
        await removeArtist(userOneID, "Joe Somebody");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete artist that isn't present
    try {
        await removeArtist(userOneID, "Joe Somebody");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete song
    try {
        await removeSong(userOneID, "Hello There, I am Joe", "Joe Somebody");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete song that isn't present
    try {
        await removeSong(userOneID, "Hello There, I am Joe", "Joe Somebody");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete album
    try {
        await removeAlbum(userOneID, "Joe's Awesome Album", "Joe Somebody");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete album
    try {
        await removeAlbum(userOneID, "Joe's Awesome Album", "Joe Somebody");
        userOne = await getUserByID(userOneID);
        console.dir(userOne, {depth: null});
    }
    catch(e) {
        console.log(e);
    }

    //Delete user one
    let deletionMessage;
    try {
        deletionMessage = await deleteUser(userOneID);
        console.log(deletionMessage);
    }
    catch(e) {
        console.log(e);
    }

    console.log("All done!");
}

main();