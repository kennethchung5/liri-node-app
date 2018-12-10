require("dotenv").config();

var keys = require("./keys");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var fs = require("fs");
var moment = require("moment");



//here, construct parameter from arguments after [2]

switch (process.argv[2].toLowerCase()) {
    case "concert-this": 
        console.log("option1");
        break;
    case "spotify-this-song":
        console.log("option2");
        break;
    case "movie-this": 
        console.log("option3");
        break;
    case "do-what-it-says":
        console.log("option4");
        break;
    default:
        console.log("that command is not recognized")
    
}


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

concertThis("john");