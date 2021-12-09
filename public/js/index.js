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

$(function() {
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
            event.preventDefault();
            let providedUsername = usernameInput.value;
            if (!providedUsername) {
                errorOnPage("Username not provided");
                return false;
            }
            if (typeof providedUsername != "string") {
                errorOnPage("Username must be a string");
                return false;
            }
            let trimmedUsername = providedUsername.trim();
            if (!validUsername(trimmedUsername)) {
                errorOnPage("Username must be at least four characters long, and only contain letters and numbers.");
                return false;
            }

            let providedPassword = passwordInput.value;
            if (!providedPassword) {
                errorOnPage("Password not provided");
                return false;
            }
            if (typeof providedPassword != "string") {
                errorOnPage("Password must be a string");
                return false;
            }
            let trimmedPassword = providedPassword.trim();
            if (!validPassword(trimmedPassword)) {
                errorOnPage("Password must be at least six characters long, and not contain any spaces.");
                return false;
            }

            errorDiv.innerHTML = "Logging in...";
            //TODO: Find out how to post
            let loginPOST = {
                method: "POST",
                url: "/loginlogout",
                contentType: "application/json",
                data: JSON.stringify({ 
                    username: providedUsername, 
                    password: providedPassword 
                })
            };
            console.log("About to do AJAX request");
            $.ajax(loginPOST).then((response) => {console.log("Success!"); window.location = "/";}).catch((response) => {console.log("Failure..."); document.write(response.responseText);});
        });
    }

    //Signup Form
    let signupForm = document.getElementById("signup-form");
    let password2Input = document.getElementById("password2");
    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let providedUsername = usernameInput.value;
            if (!providedUsername) {
                errorOnPage("Username not provided");
                return false;
            }
            if (typeof providedUsername != "string") {
                errorOnPage("Username must be a string");
                return false;
            }
            let trimmedUsername = providedUsername.trim();
            if (!validUsername(trimmedUsername)) {
                errorOnPage("Username must be at least four characters long, and only contain letters and numbers.");
                return false;
            }

            let providedPassword = passwordInput.value;
            if (!providedPassword) {
                errorOnPage("Password not provided");
                return false;
            }
            if (typeof providedPassword != "string") {
                errorOnPage("Password must be a string");
                return false;
            }
            let trimmedPassword = providedPassword.trim();
            if (!validPassword(trimmedPassword)) {
                errorOnPage("Password must be at least six characters long, and not contain any spaces.");
                return false;
            }

            let providedPassword2 = password2Input.value;
            if (!providedPassword2) {
                errorOnPage("Please repeat your password");
                return false;
            }
            if (typeof providedPassword != "string") {
                errorOnPage("Repeated password must be a string");
                return false;
            }
            let trimmedPassword2 = providedPassword2.trim();
            if (trimmedPassword != trimmedPassword2) {
                errorOnPage("Passwords don't match");
                return false;
            }

            errorDiv.innerHTML = "Signing up...";
            //TODO: Find out how to post
            let signupPOST = {
                method: "POST",
                url: "/signup",
                contentType: "application/json",
                data: JSON.stringify({ 
                    username: trimmedUsername, 
                    password: trimmedPassword, 
                    password2: trimmedPassword2 
                })
            };
            $.ajax(signupPOST).then(() => window.location = "/").catch((response) => document.write(response.responseText));
        });
    }

    //Search Form
    let searchForm = document.getElementById("search-form");
    let searchBox = document.getElementById("searchbox");
    let productionYear = document.getElementById("prodYear");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let searchTerm = searchBox.value;
            if (!searchTerm) {
                errorOnPage("Search term not provided");
                return false;
            }
            if (typeof searchTerm != "string") {
                errorOnPage("Search term must be a string");
                return false;
            }
            let trimmedSearchTerm = searchTerm.trim();
            if (!trimmedSearchTerm) {
                errorOnPage("Search term cannot be whitespace");
                return false;
            }
            let year;
            if(productionYear) {
                year = productionYear.value;
                if (year) {
                    if (typeof year != "number") {
                        errorOnPage("If provided, year should be a number");
                        return false;
                    }
                }
            }

            errorDiv.hidden = true;
            //TODO: Find out how to post
            let tag;
            if (year) {
                tag = year.toString();
            }

            let searchPOST = {
                method: "POST",
                url: searchForm.action,
                data: { searchbox: trimmedSearchTerm, tag: tag },
            };
            $.ajax(searchPOST).then((response => document.write(response)));
        });
    }
});
