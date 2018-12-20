require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var Spotify = new Spotify(keys.spotify);

//OMDB API FUNCTION
function movie() {

    var args = process.argv;
    var movieName = "";

    for (i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            movieName = movieName + "+" + args[i];
        } else {
            movieName = args[i];
        }
    };

    if (movieName === "") {
        movieName = "Mr." + "+" + "Nobody"
    };

    // PULL FROM API
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("-------------------------------------------------------------------------------------------");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("-------------------------------------------------------------------------------------------");
        } else {
            console.log("Whoops!");
        }
    });
};

//BANDS IN TOWN API FUNCTION
var Bands = function(artist) {
    // PULL FROM API
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    request(queryURL, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
  
        if (!jsonData.length) {
          console.log("No results found for " + artist);
          return;
        }
        console.log("Upcoming concerts for " + artist + ":");
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
          console.log(
            show.venue.city +
              "," +
              (show.venue.region || show.venue.country) +
              " at " +
              show.venue.name +
              " " +
              moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    });
  };
   

//SPOTIY FUNCTION
function song() {

    var args = process.argv;
    var songName = "";

    for (i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            songName = songName + " " + args[i];
        } else {
            songName = args[i];
        }
    };
    if (args.length < 4) {
        songName = "The Sign"
        process.argv[3] = songName;
    }
    Spotify.search({
        type: "track",
        query: songName,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log("Whoops! " + err);
            return;
        }
        console.log("-------------------------------------------------------------------------------------------");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("-------------------------------------------------------------------------------------------");
    });
};

//RANDOM FUNCTION
var doSome = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };
  
// TERMINAL COMMAND FUNCTION TO CHOOSE
var pick = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
        Bands(functionData);
        break;
    case "spotify-this-song":
        song(functionData);
        break;
    case "movie-this":
        movie(functionData);
        break;
    case "do-what-it-says":
        doSome();
        break;
    default:
        console.log("LIRI doesn't know that!");
    }
};
      
var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));
      



// OLD CODEeeee



// require("dotenv").config();
// //Bands in Town Function
// "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

// // Spotify Function
// function getSong(songName) {
//     var spotify = new Spotify(keys.spotify);

//     //If no song is provided, use "The Sign" 
//         if (!songName) {
//             songName = "The Sign";
//         };        

//         console.log(songName);

//         //Callback to spotify to search for song name
//         spotify.search({ type: 'track', query: songName}, function(err, data) {
//             if (err) {
//                 return console.log('Error occurred: ' + err);
//             } 
//             console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
//             "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url); 
            
//             //Creates a variable to save text into random.txt file
//             var logSong = "Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
//             "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url + "\n";
            
//             //Appends text to random.txt file
//             fs.appendFile('log.txt', logSong, function (err) {
//                 if (err) throw err;
//               });
            
//             logResults(data);
//         });
// };

// //end of Spotify Function

// //OMDB Function
// function aMovieForMe(){
// 	console.log("Netflix and Chill?");

// 	//same as above, test if search term entered
// 	var searchMovie;
// 	if(secondCommand === undefined){
// 		searchMovie = "Mr. Nobody";
// 	}else{
// 		searchMovie = secondCommand;
// 	};

// 	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json';
//    	request(url, function(error, response, body){
// 	    if(!error && response.statusCode == 200){
// 	        console.log("Title: " + JSON.parse(body)["Title"]);
// 	        console.log("Year: " + JSON.parse(body)["Year"]);
// 	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
// 	        console.log("Country: " + JSON.parse(body)["Country"]);
// 	        console.log("Language: " + JSON.parse(body)["Language"]);
// 	        console.log("Plot: " + JSON.parse(body)["Plot"]);
// 	        console.log("Actors: " + JSON.parse(body)["Actors"]);
// 	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
// 	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
// 	    }
//     });
// };//end movie-this