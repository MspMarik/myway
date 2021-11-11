//This file contains all the functions required to get the artists, songs, and albums by lastfm

const axios = require("axios");
const key_location = require("./lastfmkey.json")

const api_key = key_location.key;
const baseURL = "ws.audioscrobbler.com/2.0/?api_key=" + api_key + "&format=json&method=" //Remember to supply method for each function that uses this base

async function getArtistsByTextInput(input) {
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

    let requestURL = baseURL + `artist.search&artist=${trimmedInput}`;
    const artists = await axios.get(requestURL);
    return artists;
}

async function getSongsByTextInput(input) {
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

    let requestURL = baseURL + `track.search&track=${trimmedInput}`;
    const songs = await axios.get(requestURL);
    return songs;
}

async function getAlbumsByTextInput(input) {
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

    let requestURL = baseURL + `album.search&album=${trimmedInput}`;
    const albums = await axios.get(requestURL);
    return albums;
}

module.exports = {getArtistsByTextInput, getSongsByTextInput, getAlbumsByTextInput};