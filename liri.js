//still to do: 1.add default queries 2. output log.txt

require("dotenv").config();

var keys = require("./keys");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var fs = require("fs");
var moment = require("moment");




var command;
var queryTerm;

if (process.argv[2].toLowerCase() === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        // account for extra commas (commas in the artist/song/movie name)
        var argsArray = data.split(",");

        command = argsArray[0].toLowerCase();
        queryTerm = argsArray.slice(1).join(",").replace(/"/g, "");

        // call switchBoard here so that command is not evaluated until its value is assigned
        switchBoard();        
    })
} else {
    command = process.argv[2].toLowerCase();
    queryTerm = process.argv.slice(3).join(" ");

    switchBoard();
};




// wrap the switch statement in a function so that it will not be executed until after random.txt has been read, if needed
function switchBoard() {
    // console.log("The value of command is: " + command);

    switch (command) {
        case "concert-this": 
            // console.log("option1");
            concertThis(queryTerm);
            break;
        case "spotify-this-song":
            // console.log("option2");
            spotifyThisSong(queryTerm);
            break;
        case "movie-this": 
            // console.log("option3");
            movieThis(queryTerm);
            break;
        default:
            console.log("That command is not recognized")        
    };
};


function concertThis(artist) {

    if (!artist) {
        console.log("The artist will be assigned.");
        artist = "Marian Hill";
        console.log("Artist: " + artist);
    };

    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    
    axios.get(url).then(function(response) {

        if (response.data === '{warn=Not found}\n') {
            console.log("That artist was not found.");
        } else {
        
            var eventsArray = response.data

            var concertData = "";

            for (var i=0; i<eventsArray.length; i++) {
                concertData +=  "\r\nVenue: " + eventsArray[i].venue.name + 
                                "\r\nLocation: " + eventsArray[i].venue.city + ", " + eventsArray[i].venue.country + 
                                "\r\nDate: " + moment(eventsArray[i].datetime).format("MM/DD/YYYY") + 
                                "\r\n-----";
            };

            logInfo(command + " " + artist, concertData);
        };
    })
}



function spotifyThisSong(song) {

        if (!song) {
            console.log("The song will be assigned.");
            song = "The Sign Ace of Base";
        };
        
        spotify.search({type: "track", query: song, limit: 1}).then(function(response) {        
            
            if (response.tracks.items.length === 0) {
                console.log("That song was not found.")
            } else {

            var songData; 
            songData =   "Artist(s): " + response.tracks.items[0].artists[0].name + 
                            "\r\nSong: " + response.tracks.items[0].name +
                            "\r\nPreview: " + response.tracks.items[0].preview_url +
                            "\r\nAlbum: " + response.tracks.items[0].album.name

            logInfo(command + " " + song, songData);

            };
        })        
}



function movieThis(movie) {

    if (!movie) {
        console.log("The movie will be assigned.");
        movie = "Mr. Nobody";
    };

    var url = "http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + movie

    axios.get(url).then(function(response) {

        if (response.data.Error) {
            console.log(response.data.Error);
        } else {                
        
        var movieData;

        movieData = "Title: " + response.data.Title + 
                    "\r\nYear: " + response.data.Year + 
                    "\r\nIMDB Rating: " + response.data.imdbRating + 
                    "\r\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + 
                    "\r\nCountry: " + response.data.Country + 
                    "\r\nLanguage: " + response.data.Language + 
                    "\r\nPlot: " + response.data.Plot + 
                    "\r\nActors: " + response.data.Actors;

        logInfo(command + " " + movie, movieData);

        }
    })
}



function logInfo(commandInfo, responseInfo) {
    console.log(responseInfo);

    fs.appendFile("log.txt", commandInfo + "\r\n" + responseInfo + "\r\n----------\r\n", function(error) {
        if (error) {
            console.log(error);
        }
    })
};