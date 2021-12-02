//This file contains all the functions required to get the artists, songs, and albums by lastfm

const axios = require("axios");
const key_location = require("./lastfmkey.json")

const api_key = key_location.key;
const baseURL = "https://ws.audioscrobbler.com/2.0/?api_key=" + api_key + "&format=json&method=" //Remember to supply method for each function that uses this base

//Should be a more efficient filtering function than the previous one.
async function filterArtists(artists, filters) {
    let filteredArtists = []; //Start with empty list (assume no artists will make it through)
    for(let i = 0; i < artists.length; i++) {
        let artistInfo = await axios.get(baseURL + `artist.getInfo&artist=${artists[i].name}`); //I don't think there will be a way around this
        let tagsList = artistInfo.data.artist.tags.tag;
        let filteringMap = new Map();
        for(let j = 0; j < tagsList.length; j++) { //For each tag the artist has, put it in the map
            filteringMap.set(tagsList[j].name, true);
        }
        let tagPresent = true;
        for(let j = 0; j < filters.length; j++) { //Attempt to fetch each tag present in the filter criteria
            tagPresent = filteringMap.get(filters[j]);
            if(!tagPresent) { //If tag is not present, it will appear as undefined
                break;
            }
        }
        if(tagPresent) { //If all tags are present (tagPresent remained true), add the artist to the filtered list
            filteredArtists.push(artists[i]);
        }
    }
    return filteredArtists;
}

async function filterSongs(songs, filters) {
    let filteredSongs = []; //Start with empty list (assume no songs will make it through)
    for(let i = 0; i < songs.length; i++) {
        let songInfo = await axios.get(baseURL + `track.getInfo&artist=${songs[i].artist}&track=${songs[i].name}`);
        let tagsList = songInfo.data.track.tags.tag;
        let filteringMap = new Map();
        for(let j = 0; j < tagsList.length; j++) { //For each tag the song has, put it in the map
            filteringMap.set(tagsList[j].name, true);
        }
        let tagPresent = true;
        for(let j = 0; j < filters.length; j++) { //Attempt to fetch each tag present in the filter criteria
            tagPresent = filteringMap.get(filters[j]);
            if(!tagPresent) { //If tag is not present, it will appear as undefined
                break;
            }
        }
        if(tagPresent) { //If all tags are present (tagPresent remained true), add the song to the filtered list
            filteredSongs.push(songs[i]);
        }
    }
    return filteredSongs;
}

async function filterAlbums(albums, filters) {
    let filteredAlbums = []; //Start with empty list (assume no albums will make it through)
    for(let i = 0; i < songs.length; i++) {
        let albumInfo = await axios.get(baseURL + `album.getInfo&artist=${album.artist}&album=${album.name}`);
        let tagsList = albumInfo.data.album.tags.tag;
        let filteringMap = new Map();
        for(let j = 0; j < tagsList.length; j++) { //For each tag the album has, put it in the map
            filteringMap.set(tagsList[j].name, true);
        }
        let tagPresent = true;
        for(let j = 0; j < filters.length; j++) { //Attempt to fetch each tag present in the filter criteria
            tagPresent = filteringMap.get(filters[j]);
            if(!tagPresent) { //If tag is not present, it will appear as undefined
                break;
            }
        }
        if(tagPresent) { //If all tags are present (tagPresent remained true), add the album to the filtered list
            filteredAlbums.push(albums[i]);
        }
    }
    return filteredAlbums;
}

async function getArtistsByTextInput(input, userTags = undefined) {
    if(!input) {
        throw "Input not provided";
    }
    if(typeof input != "string") {
        throw "Input must be a string";
    }
    let trimmedInput = input.trim();
    if(!trimmedInput) {
        throw "Input cannot be whitespace";
    }

    if(userTags && !Array.isArray(userTags)) {
        throw "If provided, search tags must be in the form of an array";
    }

    let requestURL = baseURL + `artist.search&artist=${trimmedInput}&limit=10`;
    const {data} = await axios.get(requestURL);
    const artists = data.results.artistmatches.artist;

    let filteredArtists;
    if(userTags) {
        filteredArtists = await filterArtists(artists, userTags);
    }
    else {
        filteredArtists = artists;
    }
    return filteredArtists;
}

async function getSongsByTextInput(input, userTags = undefined) {
    if(!input) {
        throw "Input not provided";
    }
    if(typeof input != "string") {
        throw "Input must be a string";
    }
    let trimmedInput = input.trim();
    if(!trimmedInput) {
        throw "Input cannot be whitespace";
    }

    if(userTags && !Array.isArray(userTags)) {
        throw "If provided, search tags must be in the form of an array";
    }

    let requestURL = baseURL + `track.search&track=${trimmedInput}&limit=10`;
    const {data} = await axios.get(requestURL);
    const songs = data.results.trackmatches.track;

    let filteredSongs;
    if(userTags) {
        filteredSongs = await filterSongs(songs, userTags);
    }
    else {
        filteredSongs = songs;
    }
    return songs;
}

async function getAlbumsByTextInput(input, userTags = undefined) {
    if(!input) {
        throw "Input not provided";
    }
    if(typeof input != "string") {
        throw "Input must be a string";
    }
    let trimmedInput = input.trim();
    if(!trimmedInput) {
        throw "Input cannot be whitespace";
    }

    if(userTags && !Array.isArray(userTags)) {
        throw "If provided, search tags must be in the form of an array";
    }

    let requestURL = baseURL + `album.search&album=${trimmedInput}&limit=10`;
    const {data} = await axios.get(requestURL);
    const albums = data.results.albummatches.album;

    let filteredAlbums;
    if(userTags) {
        filteredAlbums = await filterAlbums(albums, userTags);
    }
    else {
        filteredAlbums = albums;
    }
    return filteredAlbums;
}

module.exports = {getArtistsByTextInput, getSongsByTextInput, getAlbumsByTextInput};