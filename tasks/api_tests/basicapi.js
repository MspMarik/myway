const lastfm = require("../data/lastfm");

async function main() {
    try {
        let artistSearch = await lastfm.getArtistsByTextInput("cher");
        console.log(artistSearch);
    }
    catch(e) {
        console.log(e);
    }
    console.log("-------------------------");
    try {
        let songSearch = await lastfm.getSongsByTextInput("Believe");
        console.log(songSearch);
    }
    catch(e) {
        console.log(e);
    }
    console.log("-------------------------");
    try {
        let albumSearch = await lastfm.getAlbumsByTextInput("believe");
        console.log(albumSearch);
    }
    catch(e) {
        console.log(e);
    }

    console.log("All done!");
}

main();