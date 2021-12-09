$(function() {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Task", "Hours per Day"],
            ["Work", 11],
            ["Eat", 2],
            ["Commute", 2],
            ["Watch TV", 2],
            ["Sleep", 7],
        ]);

        var options = {
            title: "My Daily Activities",
        };

        var chart = new google.visualization.PieChart(document.getElementById("piechart"));

        chart.draw(data, options);
    }


    /*
        Clientside Error Handling Functions
    */
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
    if(loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let providedUsername = usernameInput.value;
            if(!providedUsername) {
                errorOnPage("Username not provided");
                return false;
            }
            if(typeof providedUsername != "string") {
                errorOnPage("Username must be a string");
                return false;
            }

            let providedPassword = passwordInput.value;
            if(!providedPassword) {
                errorOnPage("Password not provided");
                return false;
            }
            if(typeof providedPassword != "string") {
                errorOnPage("Password must be a string");
                return false;
            }

            errorDiv.hidden = true;
            //TODO: Find out how to post
            let loginPOST = {
                method: "POST",
                url: "/loginlogout",
                data: {username: providedUsername, password: providedPassword}
            }
            $.ajax(loginPOST);
            
        });
    }

    //Signup Form
    let signupForm = document.getElementById("signup-form");
    let password2Input = document.getElementById("password2");
    if(signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let providedUsername = usernameInput.value;
            if(!providedUsername) {
                errorOnPage("Username not provided");
                return false;
            }
            if(typeof providedUsername != "string") {
                errorOnPage("Username must be a string");
                return false;
            }
            let trimmedUsername = providedUsername.trim();
            if(!validUsername(trimmedUsername)) {
                errorOnPage("Username must be at least four characters long, and only contain letters and numbers.");
            }

            let providedPassword = passwordInput.value;
            if(!providedPassword) {
                errorOnPage("Password not provided");
                return false;
            }
            if(typeof providedPassword != "string") {
                errorOnPage("Password must be a string");
                return false;
            }
            let trimmedPassword = providedPassword.trim();
            if (!validPassword(cleanedPassword)) {
                errorOnPage("Password must be at least six characters long, and not contain any spaces.");
            }

            let providedPassword2 = password2Input.value;
            if(!providedPassword2) {
                errorOnPage("Please repeat your password");
                return false;
            }
            if(typeof providedPassword != "string") {
                errorOnPage("Repeated password must be a string");
                return false;
            }
            let trimmedPassword2 = providedPassword2.trim();
            if(trimmedPassword != trimmedPassword2) {
                errorOnPage("Passwords don't match");
                return false;
            }

            errorDiv.hidden = true;
            //TODO: Find out how to post
            let signupPOST = {
                method: "POST",
                url: "/signup",
                data: {username: trimmedUsername, password: trimmedPassword, password2: trimmedPassword2}
            }
            $.ajax(signupPOST);

        });
    }

    //Search Form
    let searchForm = document.getElementById("search-form");
    let searchBox = document.getElementById("searchbox");
    let productionYear = document.getElementById("prodYear");
    if(searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let searchTerm = searchBox.value;
            if(!searchTerm) {
                errorOnPage("Search term not provided");
                return false;
            }
            if(typeof request.body.searchbox != "string") {
                errorOnPage("Search term must be a string");
                return false;
            }
            let trimmedSearchTerm = searchTerm.trim();
            if(search)
            let year = productionYear.value;
            if(year) {
                if (typeof year != "number") {
                    errorOnPage("If provided, year should be a number");
                    return false;
                }
            }

            errorDiv.hidden = true;
            //TODO: Find out how to post
            let tag;
            if(year) {
                tag = year.toString();
            }

            let searchPOST = {
                method: "POST",
                url: searchForm.action,
                data: {searchbox: trimmedSearchTerm, tag: tag}
            }
            $.ajax(searchPOST);

        });
    }
});