// Standard paackages
var Crypto = require('crypto');
var FileSystem = require("fs");
var HTTPS = require("https");
var ImageMagick = require("imagemagick");
var Sequelize = require('sequelize');
var Twitter = require('twitter');
var Imgur = require('imgur');

// My libraries of stuff
var Background = require("./lib/Background");
var Database = require("./lib/Database");
var Imaging = require("./lib/Imaging")
var JerkTweets = require("./lib/JerkTweets");

var express = require('express');
var app = express();

var fs = require('fs');
var imageMagick = require('imagemagick');
var https = require('https');

// Setup Twitter client 
const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
// Setup database 
const database = new Database(Sequelize);
// Setup background 
const key = "join_chemical car balloon";
const hash = Crypto.createHash('md5').update(key).digest('hex');
const background = new Background(HTTPS, ImageMagick, FileSystem, hash);
const imaging = new Imaging(background, FileSystem, ImageMagick);

/*
@jimlindforpope => 30379671
@realdonaldtrump => 25073877
@foxnews => 1367531
@msnbc => 2836421
@cnn => 759251
*/
/*
TwitterClient.stream('statuses/filter', {follow: '1367531'},  function(stream) {
  stream.on('data', function(tweet) {
    
    var creationTime = tweet.created_at || '';
    var userId = (tweet.user || {}).id_str || '0';
    var tweetId = tweet.id_str || '';
    var tweetText = tweet.text || '';
    var tweetFullText = (tweet.extended_tweet || {}).full_text || '';
    
    var newsString ='NOW: ' + new Date().toISOString() + '  ::::  ';
    if (userId == '1367531') {
      if (tweetFullText) {
        newsString += "FULL TEXT: " + tweetFullText + "\r\n";
      } else {
        newsString += "TEXT: " + tweetText + "\r\n";
      }
      fs.appendFileSync(".data/news.txt", newsString);
      console.log('news!');
      console.log(newsString);
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
/*
*/

// var stream = T.stream('statuses/filter', { follow: ['@FoxNews', '@CNN', '@MSNBC', 'jimlindforpope', '@jimlindforpope'] })
// stream.on('data', function (tweet) {
  // console.log("!!");
  // console.log(tweet);
// })

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get("/", function (request, response) {
  var tweetDataList = [];
  database.findPageOfTweets().then(function(tweetList) {
    tweetList.forEach(function(tweet) {
      tweetDataList.push({id:tweet.tweetId, url:tweet.imgurURL});
    });
    response.render('index', {
      title: 'AnonJerkTweets',
      tweetList: tweetDataList
    })
  });
});

app.get("/refresh", function (request, response) {
  const jerkTweets = new JerkTweets(twitterClient, database, imaging, Imgur);
  jerkTweets.timeline();
  jerkTweets.stream();
  response.send({'refreshed': true});
})

app.get("/image", function (request, response) {
  // const hash = CryptoPackage.createHash('md5').update(key).digest('hex');
  // var background = new BackgroundLib(HTTPSPackage, ImageMagickPackage, FileSystemPackage, hash);
  // background.get(function(filename){
  //   var imageResponse = new ImageResponseLib(FileSystemPackage, ImageMagickPackage);
  //   imageResponse.build(filename, (newFilename) => {
  //     fs.readFile(newFilename, function (err, data) {
  //       if (err) throw err;
  //       response.writeHead(200, {'Content-Type': 'image/jpeg' })
  //       response.end(data)
  //     });
  //   });
  // });
  response.end("%");
});

app.get("/t", function (request, response) {
  const jerkTweets = new JerkTweets(twitterClient, database);
  const area = jerkTweets.calcArea();
  console.log(area);  response.end("/" + area);
  
  // var background = new Background(require("https"), require("imagemagick"), require("fs"));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});