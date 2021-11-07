const {users} = require("../config/mongoCollections");
const {ObjectId} = require("mongodb");

//Inserts a user into the database once an account is created
async function createUser(username, password) {
    //Username Verification
    if(!username) {
        throw "Username not provided";
    }
    if(typeof username != "string") {
        throw "Username must be a string";
    }
    if(username.trim().length <= 0) {
        throw "Username is whitespace";
    }

    //Password Verification
    if(!password) {
        throw "Password not provided";
    }
    if(typeof password != "string") {
        throw "Password must be a string";
    }
    if(username.trim().length <= 0) {
        throw "Password is whitespace";
    }

    newPass = password;

    //TODO: Hash password

    //Check to see if another user already has said username, throw(?) if they do.
    if(!checkUsernameAvailable(username)) {
        throw "Username is already taken";
    } 

    //Add the user into the database
    const newUser = {
        username: username,
        hashedPassword: newPass,
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

    //Return the user
    const user = await getUserByCredentials(username, newPass);
    return user;
}

//Not too sure if this function is necessary
async function getUserByID(id) {
    //ID Verification
    if(!id) {
        throw "User ID not provided";
    }
    if(typeof id != "string") {
        throw "User ID must be a string";
    }
    if(id.trim().length <= 0) {
        throw "User ID is whitespace";
    }

    ObjID = ObjectId(id);

    const userCollection = await users();

    const user = await userCollection.findOne({ _id: id });

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
    if(username.trim().length <= 0) {
        throw "Username is whitespace";
    }

    const userCollection = await users();

    const user = await userCollection.findOne({ username: username }, { projection: {_id:1} } );

    //Returns true if username is available, returns false if username is already taken
    return !user;
}

//Used for fetching user after log-in
async function getUserByCredentials(username, password) {
    //Username Verification
    if(!username) {
        throw "Username not provided";
    }
    if(typeof username != "string") {
        throw "Username must be a string";
    }
    if(username.trim().length <= 0) {
        throw "Username is whitespace";
    }

    //Password Verification
    if(!password) {
        throw "Password not provided";
    }
    if(typeof password != "string") {
        throw "Password must be a string";
    }
    if(username.trim().length <= 0) {
        throw "Password is whitespace";
    }

    newPass = password;
    
    //TODO: Hash password

    const userCollection = await users();

    const user = await userCollection.findOne({ username: username, hashedPassword: newPass });

    if(!user) {
        throw "User not found";
    }
    else {
        return user;
    }
}





