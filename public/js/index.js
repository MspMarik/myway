google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function addLikedArtist(name) {
    let addRequest = {
        method: "POST",
        url: "/search/addLikedArtist",
        data: { artistName: name },
    };
    $.ajax(addRequest);
}

function addDislikedArtist(name) {
    let addRequest = {
        method: "POST",
        url: "/search/addDislikedArtist",
        data: { artistName: name },
    };
    $.ajax(addRequest);
}

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

    var data;
    if (likedArr[0][1] != undefined) {
        data = google.visualization.arrayToDataTable(likedArr);
        var options = {
            title: "My Liked Songs",
        };
        var chart = new google.visualization.PieChart(document.getElementById("piechart1"));
        chart.draw(data, options);
    }

    if (dislikedArr[0][1] != undefined) {
        data = google.visualization.arrayToDataTable(dislikedArr);
        options = {
            title: "My Disliked Songs",
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
        if (productionYear) {
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

//Search Add Album Form
let addAlbumForms = document.getElementsByClassName("addAlbumForm");
let addAlbumFormValueContainers = document.getElementsByClassName("ranking");

if(addAlbumForms) {
    albumFormArray = Array.from(addAlbumForms);
    albumValueArray = Array.from(addAlbumFormValueContainers);
    for(let i = 0; i < albumFormArray.length; i++) {
        albumFormArray[i].addEventListener("submit", (event) => {
            let albumValue = albumValueArray[i].value;
            if(!albumValue) {
                errorOnPage("Album ranking not provided");
                event.preventDefault();
                return false;
            }
            if(typeof albumValue != "number") {
                errorOnPage("Album ranking must be a number");
                event.preventDefault();
                return false;
            }
            if(albumValue < 0 || albumValue > 10) {
                errorOnPage("Album ranking must be in between 0 and 10");
                event.preventDefault();
                return false;
            }
        });
    }
}


//Edit Ranking Form
let editRankingForm = document.getElementById("updateForm");
let editValueContainer = document.getElementById("ranking");

if(editRankingForm) {
    editRankingForm.addEventListener("submit", (event) => {
        let newRanking = editValueContainer.value;
        if (!newRanking) {
            errorOnPage("New ranking not provided");
            event.preventDefault();
            return false;
        }
        if (typeof newRanking != "number") {
            errorOnPage("New ranking should be a number");
            event.preventDefault();
            return false;
        }
        if(newRanking < 0 || newRanking > 10) {
            errorOnPage("New ranking must be in between 0 and 10");
            event.preventDefault();
            return false;
        }
    });
}

//Shuffle Form
let shuffleForm = document.getElementById("shuffleForm");
let tagContainer = document.getElementById("tag");

if(shuffleForm) {
   shuffleForm.addEventListener("submit", (event) => {
       let tag = tagContainer.value;
       if(tag && typeof tag != "string") {
           errorOnPage("If provided, shuffle tag must be a string");
           event.preventDefault();
           return false;
       }
   }); 
}

/*
AJAX Request for My Recommendations
*/
$(function () {
    let recForm = $("#recForm");
    let numRecsContainer = $("#numRecs");
    let recInfoDiv = $("#recInfoDiv");
    let recList = $("#recList");

    recForm.on("submit", (event) => {
        event.preventDefault();
        let numRecs = numRecsContainer.val();
        if (!numRecs || typeof numRecs != "number" || numRecs < 1) {
            recInfoDiv.text("Number of recommendations must be a number greater than or equal to 1");
            recInfoDiv.show();
        }
        let recommendationRequest = {
            method: "POST",
            url: "/myrecommendedartists",
            data: { numRecs: numRecs },
        };
        recInfoDiv.text("Getting your recommendations...");
        recInfoDiv.show();
        $.ajax(recommendationRequest).then((response) => {
            let recommendations = response.recommendations;
            recList.empty();
            if (!recommendations.length) {
                recInfoDiv.text("Sorry, no recommendations were found...");
                recInfoDiv.show();
            } else {
                console.log(numRecs);
                console.log(recommendations.length);
                if (numRecs > recommendations.length) {
                    recInfoDiv.text("These are all the recommendations we have!");
                } else {
                    recInfoDiv.hide();
                }
                for (let i = 0; i < recommendations.length; i++) {
                    recList.append(`<li>${recommendations[i]}</li>`);
                }
            }
        });
    });
});
