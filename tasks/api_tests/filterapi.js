const lastfm = require("../data/lastfm");

async function main() {
    try {
        let artistSearch = await lastfm.getArtistsByTextInput("cher", ["pop"]);
        console.log(artistSearch);
    }
    catch(e) {
        console.log(e);
    }
    console.log("-------------------------");
    try {
        let artistSearchTwo = await lastfm.getArtistsByTextInput("cher", ["pop", "80s"]);
        console.log(artistSearchTwo);
    }
    catch(e) {
        console.log(e);
    }
}

main();