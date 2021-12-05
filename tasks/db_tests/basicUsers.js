const {createUser, getUserByID, deleteUser} = require("../../data/users");

async function main() {
    //Add a first user
    let userOne;

    try {
        userOne = await getUserByID(await createUser("WalkerBove", "password"));
        console.log(userOne);
    }
    catch(e) {
        console.log(e);
    }

    let userTwo;

    try {
        userTwo = await getUserByID(await createUser("MalkerClove", "notpassword"));
        console.log(userTwo);
    }
    catch(e) {
        console.log(e);
    }

    let badUser;

    //No username or password provided
    try {
        badUser = await getUserByID(await createUser());
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //No password provided
    try {
        badUser = await getUserByID(await createUser("JoeSomebody"));
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Improper username provided
    try {
        badUser = await getUserByID(await createUser(1234, "yes!"));
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Improper password provided
    try {
        badUser = await getUserByID(await createUser("JoeSomebody", 1234));
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Blankspace username
    try {
        badUser = await getUserByID(await createUser("    ", "yes!"));
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Whitespace password
    try {
        badUser = await getUserByID(await createUser("JoeSomebody", "   "));
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Already provided username
    try {
        badUser = await getUserByID(await createUser("WalkerBove", "notaverygoodpassword"));
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Already provided username in a different case
    try {
        badUser = await getUserByID(await createUser("walkerbove", "notaverygoodpassword"));
        console.log(badUser);
    }
    catch(e) {
        console.log(e);
    }

    //Delete user one
    let deletionMessage;
    try {
        deletionMessage = await deleteUser(userOne._id.toString());
        console.log(deletionMessage);
    }
    catch(e) {
        console.log(e);
    }

    try {
        deletionMessage = await deleteUser(userTwo._id.toString());
        console.log(deletionMessage);
    }
    catch(e) {
        console.log(e);
    }

    console.log("All done!");
}

main();