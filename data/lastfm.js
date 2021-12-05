//TODO: Filter using a single string, and not an array of them 

//This file contains all the functions required to get the artists, songs, and albums by lastfm

const axios = require("axios");
const key_location = require("./lastfmkey.json")

const api_key = key_location.key;
const baseURL = "https://ws.audioscrobbler.com/2.0/?api_key=" + api_key + "&format=json&method=" //Remember to supply method for each function that uses this base

//Should be a more efficient filtering function than the previous one.
async function filterArtists(artists, filterString) {
    let filteredArtists = []; //Start with empty list (assume no artists will make it through)
    for(let i = 0; i < artists.length; i++) {
        let artistInfo = await axios.get(baseURL + `artist.getInfo&artist=${artists[i].name}`); //I don't think there will be a way around this
        let tagsList = artistInfo.data.artist.tags.tag;
        let tagPresent = false;
        for(let j = 0; j < tagsList.length; j++) { 
            tagPresent = (filterString == tagsList[j].name);
            if(tagPresent) {
                break;
            }
        }
        if(tagPresent) {
            filteredArtists.push(artists[i]);
        }
    }
    return filteredArtists;
}

async function filterSongs(songs, filterString) {
    let filteredSongs = []; //Start with empty list (assume no songs will make it through)
    for(let i = 0; i < songs.length; i++) {
        let songInfo = await axios.get(baseURL + `track.getInfo&artist=${songs[i].artist}&track=${songs[i].name}`);
        let tagsList = songInfo.data.track.tags.tag;
        let tagPresent = false;
        for(let j = 0; j < tagsList.length; j++) { 
            tagPresent = (filterString == tagsList[j].name);
            if(tagPresent) {
                break;
            }
        }
        if(tagPresent) {
            filteredSongs.push(songs[i]);
        }
    }
    return filteredSongs;
}

async function filterAlbums(albums, filterString) {
    let filteredAlbums = []; //Start with empty list (assume no albums will make it through)
    for(let i = 0; i < songs.length; i++) {
        let albumInfo = await axios.get(baseURL + `album.getInfo&artist=${album.artist}&album=${album.name}`);
        let tagsList = albumInfo.data.album.tags.tag;
        let tagPresent = false;
        for(let j = 0; j < tagsList.length; j++) { 
            tagPresent = (filterString == tagsList[j].name);
            if(tagPresent) {
                break;
            }
        }
        if(tagPresent) {
            filteredAlbums.push(albums[i]);
        }
    }
    return filteredAlbums;
}

async function getArtistsByTextInput(input, userTag = undefined) {
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

    let trimmedTag;
    if(userTag && (typeof userTag != string || !userTag.trim())) {
        throw "If provided, search tag must be in the form of a non-whitespace string";
    }
    else if(userTag) {
        trimmedTag = userTag.trim();
    } 

    let requestURL = baseURL + `artist.search&artist=${trimmedInput}&limit=10`; //TODO: Change the limit when filter isn't being used
    const {data} = await axios.get(requestURL);
    const artists = data.results.artistmatches.artist;

    let filteredArtists;
    if(trimmedTag) {
        filteredArtists = await filterArtists(artists, trimmedTag);
    }
    else {
        filteredArtists = artists;
    }
    return filteredArtists;
}

async function getSongsByTextInput(input, userTag = undefined) {
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

    let trimmedTag;
    if(userTag && (typeof userTag != string || !userTag.trim())) {
        throw "If provided, search tag must be in the form of a non-whitespace string";
    }
    else if(userTag) {
        trimmedTag = userTag.trim();
    } 

    let requestURL = baseURL + `track.search&track=${trimmedInput}&limit=10`;
    const {data} = await axios.get(requestURL);
    const songs = data.results.trackmatches.track;

    let filteredSongs;
    if(trimmedTag) {
        filteredSongs = await filterSongs(songs, trimmedTag);
    }
    else {
        filteredSongs = songs;
    }
    return songs;
}

async function getAlbumsByTextInput(input, userTag = undefined) {
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

    let trimmedTag;
    if(userTag && (typeof userTag != string || !userTag.trim())) {
        throw "If provided, search tag must be in the form of a non-whitespace string";
    }
    else if(userTag) {
        trimmedTag = userTag.trim();
    } 

    let requestURL = baseURL + `album.search&album=${trimmedInput}&limit=10`;
    const {data} = await axios.get(requestURL);
    const albums = data.results.albummatches.album;

    let filteredAlbums;
    if(trimmedTag) {
        filteredAlbums = await filterAlbums(albums, trimmedTag);
    }
    else {
        filteredAlbums = albums;
    }
    return filteredAlbums;
}

module.exports = {getArtistsByTextInput, getSongsByTextInput, getAlbumsByTextInput};