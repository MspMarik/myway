//This file contains all the functions for calculating metrics data
const {getUserByID} = require("./users");
const {getArtistsForRecommendations, filterArtistsForRecommendations, getArtistTags, getSongTags} = require("./lastfm");

function countTags(listOfTags) {
    let tagsObject = {};
    for(let i = 0; i < listOfTags.length; i++) {
        if(!tagsObject[listOfTags[i]]) {
            tagsObject[listOfTags[i]] = 1;
        }
        else {
            tagsObject[listOfTags[i]]++;
        }
    }
    //console.log(tagsObject);
    let dataList = [["Tags", "Number of Occurrences"]].concat(Object.entries(tagsObject));
    return dataList;
}

async function getSongDataForMetrics(userId) {
    let user = await getUserByID(userId);
    let songsList = user.favorites.songs;
    let tagsOfLiked = [];
    let tagsOfDisliked = [];
    for(let i = 0; i < songsList.length; i++) {
        let songTags = await getSongTags(songsList[i].songName, songsList[i].artistName);
        //console.log(songTags);
        if(!songsList[i].disliked) { //Song is liked
            tagsOfLiked = tagsOfLiked.concat(songTags);
        }
        else { //Song is disliked
            tagsOfDisliked = tagsOfDisliked.concat(songTags);
        }
    }
    console.log(tagsOfLiked);
    console.log(tagsOfDisliked);
    let countObject = {likedTags: undefined, dislikedTags: undefined};
    countObject.likedTags = countTags(tagsOfLiked);
    countObject.dislikedTags = countTags(tagsOfDisliked);

    return countObject
}

async function getRecommendations(userId) {
    let user = await getUserByID(userId);
    let artistList = user.favorites.artists;
    let tagsList = [];
    let topArtists = await getArtistsForRecommendations();
    for(let i = 0; i < artistList.length; i++) { //Get all the tags from the user's liked artists
        let artistTags = await getArtistTags(artistList[i].artistName);
        if(!artistList[i].disliked) {
            tagsList = tagsList.concat(artistTags);
        }
    }
    let countedList = countTags(tagsList);
    countedList.shift(); //Removes the labels put there for the metrics
    let tagAvgOccurence = 0; //Get the average number of times a tag occurs
    for(let i = 0; i < countedList.length; i++) {
        tagAvgOccurence += countedList[i][1];
    }
    tagAvgOccurence /= countedList.length;
    countedList = countedList.filter(tagCounter => {return tagCounter[1] >= tagAvgOccurence}) //Keep tag only if the number of times the tag appears is higher than or equal to the average number of times any tag appears
    let filteringTags = countedList.map(tagCounter => tagCounter[0]); //Remove the numbers from the tag names
    let recommendationList = await filterArtistsForRecommendations(topArtists, filteringTags);
    return recommendationList;
}

module.exports = {getSongDataForMetrics, getRecommendations};