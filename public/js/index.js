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

    var data = google.visualization.arrayToDataTable(likedArr);
    var options = {
        title: "My Liked Songs",
    };
    var chart = new google.visualization.PieChart(document.getElementById("piechart1"));
    chart.draw(data, options);

    data = google.visualization.arrayToDataTable(dislikedArr);
    options = {
        title: "My Liked Songs",
    };
    chart = new google.visualization.PieChart(document.getElementById("piechart2"));
    chart.draw(data, options);
}
