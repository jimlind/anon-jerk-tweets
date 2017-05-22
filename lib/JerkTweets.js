class JerkTweets {
  constructor(twitterClient, database, imaging, imgur) {
    this.userId = '25073877';
    this.twitterClient = twitterClient;
    this.database = database;
    this.imaging = imaging;
    this.imgur = imgur;
  }
  
  timeline() {
    this.twitterClient.get(
      'statuses/user_timeline',
      {user_id: this.userId},
      this.processTweetList.bind(this)
    );
  }
  
  stream() {
    
  }
  
  processTweetList(error, tweetList) {
    tweetList.forEach((tweet) => {
      this.database.findByTweetId(tweet.id_str).then((model) => {
        if (model) {
          return; 
        }
        this.processTweet(tweet);
      })  
    });   
  }
  
  processTweet(tweet) {
    this.imaging.tweetToImage(tweet, (filename) => {
      this.imgur.uploadFile(filename).then((json) => {
        this.database.upsert(tweet.id_str, json.data.link);
      });
    });
  }
}

module.exports = JerkTweets;