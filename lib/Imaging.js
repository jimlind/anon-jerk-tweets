function Imaging(background, fileSystem, imageMagick) {
  this.background = background;
  this.fileSystem = fileSystem;
  this.imageMagick = imageMagick;
}

Imaging.prototype.tweetToImage = function (tweet, callBack) {
  this.background.get((filename) => {
    this.build(tweet, filename, (newFilename) => {
      callBack(newFilename);
    });
  })
};

Imaging.prototype.build = function (tweet, filename, callBack) {

  var tweetId = tweet.id_str || '';
  var tweetTime = tweet.created_at || '';
  var tweetText = (tweet.extended_tweet || {}).full_text || (tweet.text || '');
  
  var w = 500;
  var h = 300;
  
  const timestamp = new Date().getTime();
  const random = Math.random();
  
  var input = filename;
  var output = "/tmp/composed_" + timestamp + "_" + random + ".jpg";
  
  var args = [
    // Input file
    input,
    
    // Setup global gravity
    "-gravity", "south",
        
    // Setup basic styling for text blobs
    "-background", "transparent",
    "-fill", "white",
    
    // Write the tweet text to half the screen with a heavy stroke
    "-size", w+"x"+h/2,
    "-stroke", "black",
    "-strokewidth", "6",
    "caption:" + tweetText,
    "-composite",

    // Write the same text with no stroke to cover inner stroke
    "-size", w+"x"+h/2,
    "-stroke", "none",
    "caption:" + tweetText,
    "-composite",
    
    // Write the tweet id to the upper left corner 
    "-pointsize", "16",
    "-gravity", "northwest",
    "label:" + unescape(tweetId),
    "-geometry", "+5+5",
    "-composite",  
    
    // Write the tweet time to the upper right corner
    "-pointsize", "16",
    "-gravity", "northeast",
    "label:" + unescape(tweetTime),
    "-geometry", "+5+5",
    "-composite",

    // Output file
    output
  ];
  
  this.imageMagick.convert(args, function(){
    callBack(output);
  });
}

module.exports = Imaging;