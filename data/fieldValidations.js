function validUsername(username) {
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

function validPassword(password) {
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

module.exports = {validUsername, validPassword};