//This file is intended to add some users into the database with artist, song, and album lists already filled out.
const { createUser } = require("../data/users");
const { addArtist } = require("../data/artists");
const { addAlbum } = require("../data/albums");
const { addSong } = require("../data/songs");

async function populateDB() {
    //User One
    let userOne = await createUser("userOne", "passwordOne");

    //User Two
    let userTwo = await createUser("userTwo", "passwordTwo");

    await addArtist(userTwo, "Cher");

    await addSong(userTwo, "Believe", "Cher");

    await addAlbum(userTwo, "Believe", "Cher", 10);

    //User Three
    let userThree = await createUser("userThree", "passwordThree");

    await addArtist(userThree, "Cher", true);

    await addSong(userThree, "Believe", "Cher", true);

    await addAlbum(userThree, "Believe", "Cher", 0);

    //User Four
    let userFour = await createUser("userFour", "passwordFour");

    await addArtist(userFour, "Smash Mouth");
    await addArtist(userFour, "Nickleback");
    await addArtist(userFour, "Rick Astley");

    await addSong(userFour, "All Star", "Smash Mouth");
    await addSong(userFour, "Photograph", "Nickleback");
    await addSong(userFour, "Never Gonna Give You Up", "Rick Astley");

    await addAlbum(userFour, "Astro Lounge", "Smash Mouth", 10);
    await addAlbum(userFour, "All the Right Reasons", "Nickelback", 8);
    await addAlbum(userFour, "Whenever You Need Somebody", "Rick Astley", 9);

    //User Five
    let userFive = await createUser("userFive", "passwordFive");

    await addArtist(userFive, "Lil Nas X");
    await addArtist(userFive, "Ariana Grande");
    await addArtist(userFive, "Ludwig van Beethoven", true);
    await addArtist(userFive, "Britney Spears");

    await addSong(userFive, "Old Town Road", "Lil Nas X", true);
    await addSong(userFive, "Thank U, Next", "Ariana Grande", true);
    await addSong(userFive, "Symphony No. 7 in A Major, Op. 92: II. Allegretto", "Ludwig van Beethoven");
    await addSong(userFive, "Toxic", "Britney Spears", true);

    await addAlbum(userFive, "MONTERO", "Lil Nas X", 5);
    await addAlbum(userFive, "Thank U, Next", "Ariana Grande", 5);
    await addAlbum(userFive, "Beethoven Greatest Hits", "Ludwig Van Beethoven", 5);
    await addAlbum(userFive, "In the Zone", "Britney Spears", 5);
}

populateDB();
