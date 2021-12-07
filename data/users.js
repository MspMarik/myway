const {users} = require("../config/mongoCollections");
const {ObjectId} = require("mongodb");
const {validUsername, validPassword} = require("./fieldValidations");
const bcrypt = require("bcryptjs");

//Inserts a user into the database once an account is created
async function createUser(username, password) {
    //Username Verification
    if(!username) {
        throw "Username not provided";
    }
    if(typeof username != "string") {
        throw "Username must be a string";
    }
    let trimmedUsername = username.trim().toLowerCase();
    if(!validUsername(trimmedUsername)) {
        throw "Username must be at least four characters long, and only contain letters and numbers.";
    }

    //Check to see if another user already has said username, throw(?) if they do.
    if(!(await checkUsernameAvailable(trimmedUsername))) {
        throw "Username is already taken";
    } 


    //Password Verification
    if(!password) {
        throw "Password not provided";
    }
    if(typeof password != "string") {
        throw "Password must be a string";
    }
    let trimmedPassword = password.trim();
    if(!validPassword(trimmedPassword)) {
        throw "Password must be at least six characters long, and not contain any spaces.";
    }

    //TODO: Hash password
    let hashedPassword = await bcrypt.hash(trimmedPassword, 16);

    //Add the user into the database
    const newUser = {
        username: trimmedUsername,
        hashedPassword: hashedPassword,
        favorites: {
            artists: [],
            songs: [],
            albums: []
        },
        journalEntries: [],
        accolades: []
    };

    const userCollection = await users();

    //Check to see if the user has been added into the database
    const insertionStatus = await userCollection.insertOne(newUser);
    if(insertionStatus.insertedCount == 0) {
        throw "User could not be added";
    }

    //Return the user's id
    const user = await getUserByID(insertionStatus.insertedId.toString());
    return user._id.toString();
}

//Used to get user by ID once created
async function getUserByID(userId) {
    //ID Verification
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

    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ObjID });

    if(!user) {
        throw "User not found";
    }
    else {
        return user;
    }
}

//Used for checking if username is already taken when registering account (just return ID)
async function checkUsernameAvailable(username) {
    //Username Verification
    if(!username) {
        throw "Username not provided";
    }
    if(typeof username != "string") {
        throw "Username must be a string";
    }
    let trimmedUsername = username.trim().toLowerCase();
    if(!validUsername(trimmedUsername)) {
        throw "Username must be at least four characters long, and only contain letters and numbers.";
    }

    const userCollection = await users();

    const user = await userCollection.findOne({ username: trimmedUsername }, { projection: {_id:1} } );

    //Returns true if username is available, returns false if username is already taken
    return !user;
}

//Used in log-in
async function loginUser(username, password) {
    //Username Verification
    if(!username) {
        throw "Username not provided";
    }
    if(typeof username != "string") {
        throw "Username must be a string";
    }
    let trimmedUsername = username.trim().toLowerCase();

    //Password Verification
    if(!password) {
        throw "Password not provided";
    }
    if(typeof password != "string") {
        throw "Password must be a string";
    }
    let trimmedPassword = password.trim();

    const userCollection = await users();
    const user = await userCollection.findOne({username: trimmedUsername});

    if(!user) {
        throw "Username or password is incorrect";
    }
    
    let passwordCorrect = bcrypt.compare(trimmedPassword, user.hashedPassword);

    // bcrypt results in a promise, it might be wiser to put this in a try catch but idk if it saves time or not
    if(!(await passwordCorrect)) {
        throw "Username or password is incorrect";
    }
    else {
        //Return the user's id
        return user._id.toString();
    }

}


async function deleteUser(userId) {
    //ID Verification
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

    let userToBeDeleted = await getUserByID(userId);
    let name = userToBeDeleted.username;
    const userCollection = await users(); 
    const deletionStatus = await userCollection.deleteOne({_id: ObjID});

    if(deletionStatus.deletedCount == 0) {
        throw "User could not be deleted";
    }

    return `${name} has been deleted.`;
}

module.exports = {createUser, getUserByID, checkUsernameAvailable, loginUser, deleteUser};




