const userFunctions = require("../../data/users");

async function main() {
    //Add a first user
    let userOne;

    try {
        userOne = await userFunctions.createUser("WalkerBove", "password");
        console.log(userOne);
    }
    catch(e) {
        console.log(e);
    }

    let userTwo;

    try {
        userTwo = await userFunctions.createUser("MalkerClove", "notpassword");
        console.log(userTwo);
    }
    catch(e) {
        console.log(e);
    }

    let badUser;

    //No username or password provided
    try {
        badUser = await userFunctions.createUser();
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //No password provided
    try {
        badUser = await userFunctions.createUser("Joe Somebody");
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Improper username provided
    try {
        badUser = await userFunctions.createUser(1234, "yes!");
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Improper password provided
    try {
        badUser = await userFunctions.createUser("Joe Somebody", 1234);
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Blankspace username
    try {
        badUser = await userFunctions.createUser("    ", "yes!");
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Blankspace password
    try {
        badUser = await userFunctions.createUser("Joe Somebody", "   ");
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Already provided username
    try {
        badUser = await userFunctions.createUser("WalkerBove", "notaverygoodpassword");
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Delete user one
    let deletionMessage;
    try {
        deletionMessage = await userFunctions.deleteUser(userOne.username, userOne.hashedPassword);
        console.log(deletionMessage);
    }
    catch(e) {
        console.log(e);
    }

    try {
        deletionMessage = await userFunctions.deleteUser(userTwo.username, userTwo.hashedPassword);
        console.log(deletionMessage);
    }
    catch(e) {
        console.log(e);
    }

    console.log("All done!");
}

main();