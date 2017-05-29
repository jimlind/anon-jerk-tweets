class Database {
  constructor(Sequelize) {
    // Setup the database
    this.sequelize = new Sequelize(
      "database", // Database name
      "my_user_name", // Username
      null, // Password
      {
        logging: false,
        dialect: 'sqlite',
        storage: '.data/database.sqlite',
      }
    );
    // Define model for database
    this.model = null;
    this.sequelize.authenticate().then(() => {
        this.model = this.sequelize.define('tweet', {
          tweetId: {
            type: Sequelize.STRING,
            primaryKey: true
          },
          imgurURL: {
            type: Sequelize.STRING
          }
        });
        this.model.sync();
    });
  }

  upsert(tweetId, imgurURL) {
    this.model.upsert({tweetId: tweetId, imgurURL: imgurURL});
  }
  
  findByTweetId(tweetId) {
    return this.model.findById(tweetId);
  }
  
  findPageOfTweets(pageNumber) {
    return this.model.findAll({
      offset: (pageNumber || 0) * 20,
      limit: 10,
      order: 'tweetId DESC'
    });
  }
}


module.exports = Database;