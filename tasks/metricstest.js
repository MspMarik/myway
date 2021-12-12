const {createUser, getUserByID, deleteUser} = require("../data/users");
const {addSong} = require("../data/songs");
const {getSongDataForMetrics} = require("../data/metrics");

async function main() {
    let userOneID = await createUser("WalkerBove", "password");

    await addSong(userOneID, "Believer", "Imagine Dragons", false);
    await addSong(userOneID, "I Believe in a Thing Called Love", "The Darkness", false);
    await addSong(userOneID, "Believe What I Say", "Kanye West", true);
    await addSong(userOneID, "Believe", "Cher", true);
    
    let songData = await getSongDataForMetrics(userOneID);
    console.log(songData);

    await deleteUser(userOneID);
    console.log("All done!");
}

main();

