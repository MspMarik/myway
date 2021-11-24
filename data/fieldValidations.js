function validUsername(username) { //Makes sure that all inputted usernames are at least four characters, and only contain alphanumeric input
    let trimmedUsername = username.trim();
    if(trimmedUsername.length < 4) {
        return false;
    }
    for(let i = 0; i < trimmedUsername.length; i++) {
        let isAlphabetic = (trimmedUsername[i] >= 'A' && trimmedUsername[i] <= 'z');
        let isNumeric = (trimmedUsername[i] >= '0' && trimmedUsername[i] <= '9'); 
        if(!isAlphabetic && !isNumeric) {
            return false;
        }
    }
    return true;
}

function validPassword(password) { //Makes sure that all inputted passwords are at least six characters, and don't contain any spaces
    let trimmedPassword = password.trim();
    if(trimmedPassword.length < 6) {
        return false;
    }
    for(let i = 0; i < trimmedPassword.length; i++) {
        if(trimmedPassword[i] == ' ') {
            return false;
        }
    }
    return true;
}

function validUserObject(user) { //Checks that all fields of a user object are present
    let idPresent = user._id;
    let userPresent = user.username;
    let passPresent = user.hashedPassword;
    let favoritesPresent = user.favorites;
    let entriesPresent = user.journalEntries;
    let accoladesPresent = user.accolades;
    if(!idPresent || !userPresent || !passPresent || !favoritesPresent || !entriesPresent || !accoladesPresent) {
        return false;
    }
    let artistsPresent = favoritesPresent.artists;
    let songsPresent = favoritesPresent.songs;
    let albumsPresent = favoritesPresent.albums;
    if(!Array.isArray(artistsPresent) || !Array.isArray(songsPresent) || !Array.isArray(albumsPresent)) {
        return false;
    }
    return true;
}

module.exports = {validUsername, validPassword, validUserObject};