//This file is intended to add some users into the database with artist, song, and album lists already filled out.
const {createUser} = require("../../data/users");
const {addArtist} = require("../../data/artists");
const {addAlbum} = require("../../data/albums");
const {addSong} = require("../../data/songs");

//TODO: Add some artists, albums, and songs for these guys
async function populateDB() {
    //User One
    let userOne = await userFunctions.createUser("userOne, passwordOne");

    //User Two
    let userTwo = await createUser("userTwo, passwordTwo");

    userTwo = await addArtist(userTwo, "Cher");

    userTwo = await addSong(userTwo, "Believe", "Cher");

    userTwo = await addAlbum(userTwo, "Believe", "Cher", 10);


    //User Three
    let userThree = await createUser("userThree, passwordThree");

    userThree = await addArtist(userThree, "Cher", true);

    userThree = await addSong(userThree, "Believe", "Cher", true);

    userThree = await addAlbum(userThree, "Believe", "Cher", 0);


    //User Four
    let userFour = await userFunctions.createUser("userFour, passwordFour");

    userFour = await addArtist(userFour, "Smash Mouth");
    userFour = await addArtist(userFour, "Nickleback");
    userFour = await addArtist(userFour, "Rick Astley");

    userFour = await addSong(userFour, "All Star", "Smash Mouth");
    userFour = await addSong(userFour, "Photograph", "Nickleback");
    userFour = await addSong(userFour, "Never Gonna Give You Up", "Rick Astley");

    userFour = await addAlbum(userFour, "Astro Lounge", "Smash Mouth", 10);
    userFour = await addAlbum(userFour, "All the Right Reasons", "Nickelback", 8)
    userFour = await addAlbum(userFour, "Whenever You Need Somebody", "Rick Astley", 9);


    //User Five
    let userFive = await userFunctions.createUser("userFive, passwordFive");

    userFive = await addArtist(userFive, "Lil Nas X");
    userFive = await addArtist(userFive, "Ariana Grande");
    userFive = await addArtist(userFive, "Ludwig van Beethoven", true);
    userFive = await addArtist(userFive, "Britney Spears");

    userFive = await addSong(userFive, "Old Town Road", "Lil Nas X", true);
    userFive = await addSong(userFive, "Thank U, Next", "Ariana Grande", true);
    userFive = await addSong(userFive, "Symphony No. 7 in A Major, Op. 92: II. Allegretto", "Ludwig van Beethoven");
    userFive = await addSong(userFive, "Toxic", true);

    userFive = await addAlbum(userFive, "MONTERO", "Lil Nas X", 5);
    userFive = await addAlbum(userFive, "Thank U, Next", "Ariana Grande", 5);
    userFive = await addAlbum(userFive, "Beethoven Greatest Hits", "Ludwig Van Beethoven", 5);
    userFive = await addAlbum(userFive, "In the Zone", 5);
}

await populateDB();