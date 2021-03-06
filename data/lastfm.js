//This file contains all the functions required to get the artists, songs, and albums by lastfm

const axios = require("axios");
//const key_location = require("./lastfmkey.json")

const api_key = "72fa9d4b46d0200e977b8a920742c10a";
const baseURL = "https://ws.audioscrobbler.com/2.0/?api_key=" + api_key + "&format=json&method="; //Remember to supply method for each function that uses this base



let getYear = (content) =>{
    if(!content) {
        throw "No content provided";
    }
    if(typeof content != "string") {
        throw "Content is not a string";
    }
    let arr = content.split(" ");
    let found = false;
    let n = -1;
    arr.forEach((element) => {
        if (!found) {
            if (Number.parseInt(element)) {
                n = Number.parseInt(element);
                if (n > 1900 && n <= 2021) {
                    //console.log(n);
                    found == true;
                } else {
                    n = -1;
                }
            }
        }
    });
    return n;
};

//Should be a more efficient filtering function than the previous one.
async function filterArtists(artists, filterString) {
    let filteredArtists = []; //Start with empty list (assume no artists will make it through)
    for (let i = 0; i < artists.length; i++) {
        let artistInfo = await axios.get(baseURL + `artist.getInfo&artist=${encodeURIComponent(artists[i].name)}`); //I don't think there will be a way around this
        if (artistInfo && artistInfo.data && artistInfo.data.artist && artistInfo.data.artist.tags && artistInfo.data.artist.tags.tag) {
            let tagsList = artistInfo.data.artist.tags.tag;
            let tagPresent = false;
            for (let j = 0; j < tagsList.length; j++) {
                tagPresent = filterString == tagsList[j].name;
                if (tagPresent) {
                    break;
                }
            }
            if (tagPresent) {
                filteredArtists.push(artists[i]);
            }
        }
    }
    return filteredArtists;
}

//Used when multiple tags are being used
async function filterArtistsForRecommendations(artists, filters) {
    let filteredArtists = []; //Start with empty list (assume no artists will make it through)
    for (let i = 0; i < artists.length; i++) {
        try {
            let artistInfo = await axios.get(baseURL + `artist.getInfo&artist=${encodeURIComponent(artists[i].name)}`);
            let tagsList = artistInfo.data.artist.tags.tag;
            let filteringMap = new Map();
            for (let j = 0; j < tagsList.length; j++) {
                //For each tag the artist has, put it in the map
                filteringMap.set(tagsList[j].name, true);
            }
            let tagPresent = false;
            for (let j = 0; j < filters.length; j++) {
                //Attempt to fetch each tag present in the filter criteria
                tagPresent = filteringMap.get(filters[j]);
                if (tagPresent) {
                    //If a tag is present, add the artist into the collection
                    break;
                }
            }
            if (tagPresent) {
                //If at least one tag is present (tagPresent became true), add the artist to the filtered list
                filteredArtists.push(artists[i]);
            }
        } catch (err) {
            console.log(err);
        }
    }
    return filteredArtists;
}

async function filterSongs(songs, filterString) {
    let filteredSongs = []; //Start with empty list (assume no songs will make it through)
    for (let i = 0; i < songs.length; i++) {
        let songInfo = await axios.get(baseURL + `track.getInfo&artist=${encodeURIComponent(songs[i].artist)}&track=${encodeURIComponent(songs[i].name)}`);
        if (songInfo && songInfo.data && songInfo.data.track && songInfo.data.track.toptags && songInfo.data.track.toptags.tag) {
            let tagsList = songInfo.data.track.toptags.tag;
            let tagPresent = false;
            for (let j = 0; j < tagsList.length; j++) {
                tagPresent = filterString == tagsList[j].name;
                if (tagPresent) {
                    break;
                }
            }
            if (tagPresent) {
                filteredSongs.push(songs[i]);
            }
        }
    }
    return filteredSongs;
}

async function filterAlbums(albums, filterString) {
    let filteredAlbums = []; //Start with empty list (assume no albums will make it through)
    for (let i = 0; i < songs.length; i++) {
        let albumInfo = await axios.get(baseURL + `album.getInfo&artist=${encodeURIComponent(album.artist)}&album=${encodeURIComponent(album.name)}`);
        let tagsList = albumInfo.data.album.tags.tag;
        let tagPresent = false;
        for (let j = 0; j < tagsList.length; j++) {
            tagPresent = filterString == tagsList[j].name;
            if (tagPresent) {
                break;
            }
        }
        if (tagPresent) {
            filteredAlbums.push(albums[i]);
        }
    }
    return filteredAlbums;
}

async function getArtist(artistName) {
    if (!artistName) {
        throw "Artist name not provided";
    }
    if (typeof artistName != "string") {
        throw "Artist name must be a string";
    }
    let trimmedName = artistName.trim();
    if (!trimmedName) {
        throw "Artist name cannot be whitespace";
    }

    let artistInfo = await axios.get(baseURL + `artist.getInfo&artist=${encodeURIComponent(artistName)}`);
    return artistInfo.data.artist;
}

async function getSimilarArtists(artistName) {
    if (!artistName) {
        throw "Artist name not provided";
    }
    if (typeof artistName != "string") {
        throw "Artist name must be a string";
    }
    let trimmedName = artistName.trim();
    if (!trimmedName) {
        throw "Artist name cannot be whitespace";
    }
    let requestURL = baseURL + `artist.getSimilar&artist=${encodeURIComponent(trimmedName)}`;
    let { data } = await axios.get(requestURL);
    let artists = data.similarartists.artist;
    return artists;
}

async function getArtistsByTextInput(input, userTag = undefined) {
    if (!input) {
        throw "Search term not provided";
    }
    if (typeof input != "string") {
        throw "Search term must be a string";
    }
    let trimmedInput = input.trim();
    if (!trimmedInput) {
        throw "Search term cannot be whitespace";
    }

    let trimmedTag;
    if (userTag && (typeof userTag != "string" || !userTag.trim())) {
        throw "If provided, search tag must be in the form of a non-whitespace string";
    } else if (userTag) {
        trimmedTag = userTag.trim();
    }

    let requestURL = baseURL + `artist.search&artist=${encodeURIComponent(trimmedInput)}`;
    if (userTag) {
        //Limits returned results to 10 when using filter to prevent overuse of API
        requestURL += "&limit=10";
    }
    const { data } = await axios.get(requestURL);
    const artists = data.results.artistmatches.artist;

    let filteredArtists;
    if (trimmedTag) {
        filteredArtists = await filterArtists(artists, trimmedTag);
    } else {
        filteredArtists = artists;
    }
    return filteredArtists;
}

async function getArtistTags(artistName) {
    if (!artistName) {
        throw "Artist name not provided";
    }
    if (typeof artistName != "string") {
        throw "Artist name must be a string";
    }
    if (!artistName.trim()) {
        throw "Artist name cannot be whitespace";
    }

    let artistInfo = await axios.get(baseURL + `artist.getInfo&artist=${encodeURIComponent(artistName)}`);
    return artistInfo.data.artist.tags.tag.map((tagData) => tagData.name);
}

async function getSongInfo(song, artist) {
    if (!song || !artist) {
        throw "Input not provided";
    }
    if (typeof song != "string" || typeof artist != "string") {
        throw "Input must be a string";
    }
    let trimmedsong = song.trim();
    let trimmedartist = artist.trim();
    if (!trimmedsong || !trimmedartist) {
        throw "Input cannot be whitespace";
    }

    ///2.0/?method=track.getInfo&api_key=YOUR_API_KEY&artist=cher&track=believe&format=json
    let requestURL = baseURL + `track.getInfo&track=${encodeURIComponent(trimmedsong)}&artist=${encodeURIComponent(trimmedartist)}`;
    const { data } = await axios.get(requestURL);

    if (data.error !== undefined) {
        return "N/A";
    }
    if (data === undefined || data.track.wiki === undefined || data.track.wiki.content === undefined) {
        return "N/A";
    }

    if (trimmedartist == "R??is??n Murphy") {
        console.log(data);
    }
    const year = getYear(data.track.wiki.content);

    if (year == -1) {
        return "N/A";
    }

    return year;
}
async function getSongsByTextInput(input, userTag = undefined) {
    if (!input) {
        throw "Search term not provided";
    }
    if (typeof input != "string") {
        throw "Search term must be a string";
    }
    let trimmedInput = input.trim();
    if (!trimmedInput) {
        throw "Search term cannot be whitespace";
    }

    let trimmedTag;
    if (userTag && (typeof userTag != "string" || !userTag.trim())) {
        throw "If provided, search tag must be in the form of a non-whitespace string";
    } else if (userTag) {
        trimmedTag = userTag.trim();
    }

    let requestURL = baseURL + `track.search&track=${encodeURIComponent(trimmedInput)}`;
    if (userTag) {
        //Limits returned results to 10 when using filter to prevent overuse of API
        requestURL += "&limit=10";
    }
    const { data } = await axios.get(requestURL);
    const songs = data.results.trackmatches.track;

    let filteredSongs;
    if (trimmedTag) {
        filteredSongs = await filterSongs(songs, trimmedTag);
    } else {
        filteredSongs = songs;
    }
    return filteredSongs;
}

async function getSongTags(songName, artistName) {
    if (!songName) {
        throw "Song name not provided";
    }
    if (!artistName) {
        throw "Artist name not provided";
    }
    if (typeof songName != "string") {
        throw "Song name must be a string";
    }
    if (typeof artistName != "string") {
        throw "Artist name must be a string";
    }
    if (!songName.trim()) {
        throw "Song name cannot be whitespace";
    }
    if (!artistName.trim()) {
        throw "Artist name cannot be whitespace";
    }

    let songInfo = await axios.get(baseURL + `track.getInfo&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(songName)}`);
    return songInfo.data.track.toptags.tag.map((tagData) => tagData.name);
}

async function getAlbumInfo(album, artist) {
    if (!album || !artist) {
        throw "Input not provided";
    }
    if (typeof album != "string" || typeof artist != "string") {
        throw "Input must be a string";
    }
    let trimmedalbum = album.trim();
    let trimmedartist = artist.trim();
    if (!trimmedalbum || !trimmedartist) {
        throw "Input cannot be whitespace";
    }

    ///2.0/?method=track.getInfo&api_key=YOUR_API_KEY&artist=cher&track=believe&format=json
    let requestURL = baseURL + `album.getInfo&album=${encodeURIComponent(trimmedalbum)}&artist=${encodeURIComponent(trimmedartist)}`;
    const { data } = await axios.get(requestURL);

    if (data.error !== undefined) {
        return "N/A";
    }
    if (data === undefined || data.album.wiki === undefined || data.album.wiki.content === undefined) {
        return "N/A";
    }

    const year = getYear(data.album.wiki.content);

    if (year == -1) {
        return "N/A";
    }

    return year;
}

async function getAlbumsByTextInput(input, userTag = undefined) {
    if (!input) {
        throw "Search term not provided";
    }
    if (typeof input != "string") {
        throw "Search term must be a string";
    }
    let trimmedInput = input.trim();
    if (!trimmedInput) {
        throw "Search term cannot be whitespace";
    }

    let trimmedTag;
    if (userTag && (typeof userTag != "string" || !userTag.trim())) {
        throw "If provided, search tag must be in the form of a non-whitespace string";
    } else if (userTag) {
        trimmedTag = userTag.trim();
    }

    let requestURL = baseURL + `album.search&album=${encodeURIComponent(trimmedInput)}`;
    if (userTag) {
        //Limits returned results to 10 when using filter to prevent overuse of API
        requestURL += "&limit=10";
    }
    const { data } = await axios.get(requestURL);
    const albums = data.results.albummatches.album;

    let filteredAlbums;
    if (trimmedTag) {
        filteredAlbums = await filterAlbums(albums, trimmedTag);
    } else {
        filteredAlbums = albums;
    }
    return filteredAlbums;
}

module.exports = { getArtist, filterArtistsForRecommendations, getArtistsByTextInput, getArtistTags, getSongsByTextInput, getAlbumsByTextInput, getSongInfo, getSongTags, getAlbumInfo, getSimilarArtists };
