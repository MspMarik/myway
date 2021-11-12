//This file contains all the functions required to get the artists, songs, and albums by lastfm

const axios = require("axios");
const key_location = require("./lastfmkey.json")

const api_key = key_location.key;
const baseURL = "https://ws.audioscrobbler.com/2.0/?api_key=" + api_key + "&format=json&method=" //Remember to supply method for each function that uses this base

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
        throw "If provided, user tags must be in the form of an array";
    }

    let requestURL = baseURL + `artist.search&artist=${trimmedInput}`;
    const {data} = await axios.get(requestURL);
    const artists = data.results.artistmatches.artist;
    /*
        Note 1:
        Tag information (what we would use for filtering) is not included when artist.search is used. Therefore, the mbid of the artist 
        has to be used to call artist.getInfo. This means that for any search that uses filtering, the website won't just make one call per 
        search but n+1 calls, with n being the amount of artists returned by artist.search. We should probably find a way to put a cap on the 
        number of entries so that we don't end up calling the API too much. This also applies to the songs and albums too.

        Note 2:
        (If I calculated this correctly) This filtering function is O(n*m*t), with
            n = Number of artists returned that have mbids
            m = Number of tags the user inputted
            t = The maximum number of tags that any one of the artists had
        This should be replaced with a more efficient solution, but this one is implemented for now just to get something working

        Note 3:
        This filtering system assumes that the user wants results that fit ANY tag, not all tags.
    */
    let filteredArtists;
    if(userTags) {
        filteredArtists = [];
        for(let artist of artists) {
            let artistInfo = await axios.get(baseURL + `artist.getInfo&artist=${artist.name}`);
            let tagsList = artistInfo.data.artist.tags.tag;
            let tagFound = false;
            for(let tag of tagsList) {
                for(let i = 0; i < userTags.length; i++) {
                    if(userTags[i] == tag.name) {
                        filteredArtists.push(artist);
                        tagFound = true;
                    }
                }
                if(tagFound) {
                    break;
                }
            }
        }
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
        throw "If provided, user tags must be in the form of an array";
    }

    let requestURL = baseURL + `track.search&track=${trimmedInput}`;
    const {data} = await axios.get(requestURL);
    const songs = data.results.trackmatches.track;
    let filteredSongs;
    if(userTags) {
        filteredSongs = [];
        for(let song of songs) {
            let songInfo = await axios.get(baseURL + `track.getInfo&artist=${song.artist}&track=${song.name}`);
            let tagsList = songInfo.data.track.tags.tag;
            let tagFound = false;
            for(let tag of tagsList) {
                for(let i = 0; i < userTags; i++) {
                    if(userTags[i] == tag.name) {
                        filteredSongs.push(songs);
                        tagFound = true;
                    }
                }
                if(tagFound) {
                    break;
                }
            }
        }
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
        throw "If provided, user tags must be in the form of an array";
    }

    let requestURL = baseURL + `album.search&album=${trimmedInput}`;
    const {data} = await axios.get(requestURL);
    const albums = data.results.albummatches.album;
    let filteredAlbums;
    if(userTags) {
        filteredAlbums = [];
        for(let album of albums) {
            let albumInfo = await axios.get(baseURL + `album.getInfo&artist=${album.artist}&album=${album.name}`);
            let tagsList = albumInfo.data.album.tags.tag;
            let tagFound = false;
            for(let tag of tagsList) {
                for(let i = 0; i < userTags; i++) {
                    if(userTags[i] == tag.name) {
                        filteredAlbums.push(album);
                        tagFound = true;
                    }
                }
                if(tagFound) {
                    break;
                }
            }
        }
    }
    else {
        filteredAlbums = albums;
    }
    return filteredAlbums;
}

module.exports = {getArtistsByTextInput, getSongsByTextInput, getAlbumsByTextInput};