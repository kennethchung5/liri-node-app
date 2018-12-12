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

        command = argsArray[0];
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
    console.log("The value of command is: " + command);

    switch (command) {
        case "concert-this": 
            console.log("option1");
            break;
        case "spotify-this-song":
            console.log("option2");
            break;
        case "movie-this": 
            console.log("option3");
            break;
        default:
            console.log("that command is not recognized")        
    };
};


function concertThis(artist) {

    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    
    axios.get(url).then(function(response) {
        // console.log(response.data);
        
        var eventsArray = response.data

        for (var i=0; i<eventsArray.length; i++) {
            console.log("Venue: " + eventsArray[i].venue.name + 
                        "\nLocation: " + eventsArray[i].venue.city + ", " + eventsArray[i].venue.country + 
                        "\nDate: " + moment(eventsArray[i].datetime).format("MM/DD/YYYY"))
        };

    })
}



function spotifyThisSong(song) {


    spotify.search({type: "track", query: song, limit: 1}).then(function(response) {        
        
        // console.log(response.tracks.items[0]);

        console.log("Artist(s): " + response.tracks.items[0].artists[0].name + 
                    "\nSong: " + response.tracks.items[0].name +
                    "\nPreview: " + response.tracks.items[0].preview_url + // look into making clickable link
                    "\nAlbum: " + response.tracks.items[0].album.name) 
    })
}



function movieThis(movie) {
    var url = "http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + movie

    axios.get(url).then(function(response) {
        
        console.log("Title: " + response.data.Title + 
                    "\nYear: " + response.data.Year + 
                    "\nIMDB Rating: " + response.data.imdbRating + 
                    "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + 
                    "\nCountry: " + response.data.Country + 
                    "\nLanguage: " + response.data.Language + 
                    "\nPlot: " + response.data.Plot + 
                    "\nActors: " + response.data.Actors);
    })
}



//testing
// concertThis("Backstreet Boys");
// spotifyThisSong("Edge of Desire")
// movieThis("Batman Begins")