google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    let liked = $("#liked").text().split(",");
    let disliked = $("#disliked").text().split(",");

    let likedArr = [];
    let dislikedArr = [];

    for (let i = 0; i < liked.length; i += 2) {
        likedArr.push([liked[i], liked[i + 1]]);
    }

    for (let i = 0; i < disliked.length; i += 2) {
        dislikedArr.push([disliked[i], disliked[i + 1]]);
    }

    for (let i = 0; i < likedArr.length; i++) {
        if (parseInt(likedArr[i][1])) {
            likedArr[i][1] = parseInt(likedArr[i][1]);
        }
    }

    for (let i = 0; i < dislikedArr.length; i++) {
        if (parseInt(dislikedArr[i][1])) {
            dislikedArr[i][1] = parseInt(dislikedArr[i][1]);
        }
    }

    console.log(likedArr);
    console.log(dislikedArr);

    var data;
    if(likedArr[0][1] != undefined) {
        data = google.visualization.arrayToDataTable(likedArr);
        var options = {
            title: "My Liked Songs",
        };
        var chart = new google.visualization.PieChart(document.getElementById("piechart1"));
        chart.draw(data, options);
    }

    if(dislikedArr[0][1] != undefined) {
        data = google.visualization.arrayToDataTable(dislikedArr);
        options = {
            title: "My Liked Songs",
        };
        chart = new google.visualization.PieChart(document.getElementById("piechart2"));
        chart.draw(data, options);
    }
}


/*
    Clientside Error Handling Functions
*/
function validUsername(username) {
    //Makes sure that all inputted usernames are at least four characters, and only contain alphanumeric input
    let trimmedUsername = username.trim();
    if (trimmedUsername.length < 4) {
        return false;
    }
    for (let i = 0; i < trimmedUsername.length; i++) {
        let isAlphabetic = trimmedUsername[i] >= "A" && trimmedUsername[i] <= "z";
        let isNumeric = trimmedUsername[i] >= "0" && trimmedUsername[i] <= "9";
        if (!isAlphabetic && !isNumeric) {
            return false;
        }
    }
    return true;
}

function validPassword(password) {
    //Makes sure that all inputted passwords are at least six characters, and don't contain any spaces
    let trimmedPassword = password.trim();
    if (trimmedPassword.length < 6) {
        return false;
    }
    for (let i = 0; i < trimmedPassword.length; i++) {
        if (trimmedPassword[i] == " ") {
            return false;
        }
    }
    return true;
}

let errorDiv = document.getElementById("error");

function errorOnPage(errString) {
    errorDiv.hidden = false;
    errorDiv.innerHTML = errString;
}

//Used in both login and signup
let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");

//Login Form
let loginForm = document.getElementById("login-form");
console.log(loginForm);
if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        let providedUsername = usernameInput.value;
        if (!providedUsername) {
            errorOnPage("Username not provided");
            event.preventDefault();
            return false;
        }
        if (typeof providedUsername != "string") {
            errorOnPage("Username must be a string");
            event.preventDefault();
            return false;
        }
        let trimmedUsername = providedUsername.trim();
        if (!validUsername(trimmedUsername)) {
            errorOnPage("Username must be at least four characters long, and only contain letters and numbers.");
            event.preventDefault();
            return false;
        }

        let providedPassword = passwordInput.value;
        if (!providedPassword) {
            errorOnPage("Password not provided");
            event.preventDefault();
            return false;
        }
        if (typeof providedPassword != "string") {
            errorOnPage("Password must be a string");
            event.preventDefault();
            return false;
        }
        let trimmedPassword = providedPassword.trim();
        if (!validPassword(trimmedPassword)) {
            errorOnPage("Password must be at least six characters long, and not contain any spaces.");
            event.preventDefault();
            return false;
        }
    });
}

//Signup Form
let signupForm = document.getElementById("signup-form");
let password2Input = document.getElementById("password2");
if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
        let providedUsername = usernameInput.value;
        if (!providedUsername) {
            errorOnPage("Username not provided");
            event.preventDefault();
            return false;
        }
        if (typeof providedUsername != "string") {
            errorOnPage("Username must be a string");
            event.preventDefault();
            return false;
        }
        let trimmedUsername = providedUsername.trim();
        if (!validUsername(trimmedUsername)) {
            errorOnPage("Username must be at least four characters long, and only contain letters and numbers.");
            event.preventDefault();
            return false;
        }

        let providedPassword = passwordInput.value;
        if (!providedPassword) {
            errorOnPage("Password not provided");
            event.preventDefault();
            return false;
        }
        if (typeof providedPassword != "string") {
            errorOnPage("Password must be a string");
            event.preventDefault();
            return false;
        }
        let trimmedPassword = providedPassword.trim();
        if (!validPassword(trimmedPassword)) {
            errorOnPage("Password must be at least six characters long, and not contain any spaces.");
            event.preventDefault();
            return false;
        }

        let providedPassword2 = password2Input.value;
        if (!providedPassword2) {
            errorOnPage("Please repeat your password");
            event.preventDefault();
            return false;
        }
        if (typeof providedPassword != "string") {
            errorOnPage("Repeated password must be a string");
            event.preventDefault();
            return false;
        }
        let trimmedPassword2 = providedPassword2.trim();
        if (trimmedPassword != trimmedPassword2) {
            errorOnPage("Passwords don't match");
            event.preventDefault();
            return false;
        }
    });
}

//Search Form
let searchForm = document.getElementById("search-form");
let searchBox = document.getElementById("searchbox");
let productionYear = document.getElementById("prodYear");
if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        let searchTerm = searchBox.value;
        if (!searchTerm) {
            errorOnPage("Search term not provided");
            event.preventDefault();
            return false;
        }
        if (typeof searchTerm != "string") {
            errorOnPage("Search term must be a string");
            event.preventDefault();
            return false;
        }
        let trimmedSearchTerm = searchTerm.trim();
        if (!trimmedSearchTerm) {
            errorOnPage("Search term cannot be whitespace");
            event.preventDefault();
            return false;
        }
        let year;
        if(productionYear) {
            year = productionYear.value;
            if (year) {
                if (typeof year != "number") {
                    errorOnPage("If provided, year should be a number");
                    event.preventDefault();
                    return false;
                }
            }
        }
    });
}
