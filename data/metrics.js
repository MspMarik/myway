//This file contains all the functions for calculating metrics data
const {getUserByID} = require("./users");
const {getSongTags} = require("./lastfm");

function countTags(listOfTags) {
    let tagsObject = {};
    for(let i = 0; i < listOfTags.length; i++) {
        //console.log(listOfTags[i]);
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

module.exports = {getSongDataForMetrics};