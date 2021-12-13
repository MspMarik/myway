//This file contains all the functions for calculating metrics data
const { getUserByID } = require("./users");
const { getSimilarArtists, getSongTags } = require("./lastfm");

function countTags(listOfTags) {
    let tagsObject = {};
    for (let i = 0; i < listOfTags.length; i++) {
        if (!tagsObject[listOfTags[i]]) {
            tagsObject[listOfTags[i]] = 1;
        } else {
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
    for (let i = 0; i < songsList.length; i++) {
        let songTags = await getSongTags(songsList[i].songName, songsList[i].artistName);
        //console.log(songTags);
        if (!songsList[i].disliked) {
            //Song is liked
            tagsOfLiked = tagsOfLiked.concat(songTags);
        } else {
            //Song is disliked
            tagsOfDisliked = tagsOfDisliked.concat(songTags);
        }
    }
    console.log(tagsOfLiked);
    console.log(tagsOfDisliked);
    let countObject = { likedTags: undefined, dislikedTags: undefined };
    countObject.likedTags = countTags(tagsOfLiked);
    countObject.dislikedTags = countTags(tagsOfDisliked);

    return countObject;
}

async function getRecommendations(userId, numRecs) {
    let user = await getUserByID(userId);
    let artistList = user.favorites.artists;
    let recMap = new Map();
    for (let i = 0; i < artistList.length; i++) {
        if (!artistList[i].disliked) {
            let similarArtists = await getSimilarArtists(artistList[i].artistName);
            for (let j = 0; j < similarArtists.length; j++) {
                recMap.set(similarArtists[i].name, true);
            }
        }
    }
    for (let i = 0; i < artistList.length; i++) {
        recMap.delete(artistList[i].artistName);
    }
    let recommendations = Array.from(recMap.keys());
    if (recommendations.length > numRecs) {
        //Reduce recommendations to the number of recommendations asked for
        let initLength = recommendations.length;
        for (let i = 0; i < initLength - numRecs; i++) {
            let removedIndex = Math.floor(Math.random() * recommendations.length); //Selects a random number from 0 to length-1
            recommendations.splice(removedIndex, 1);
        }
    }
    return recommendations;
}

module.exports = { getSongDataForMetrics, getRecommendations };
