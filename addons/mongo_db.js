const { MongoClient } = require('mongodb');

module.exports = class {
  constructor (url, db, collection) {
    this.client = new MongoClient(url, {
      authSource: "admin",
      useNewUrlParser: true
    });
    this.db_name = db
    this.collection_name = collection
  }

  async connect() {
    try {
      this.connection = await this.client.connect()
      console.log("[mongodb]: conected");
      this.pipe = await this.connection.db(this.db_name).collection(this.collection_name)
    } catch (error) {
      console.log(error);
      return
    }

    return this.connection
  }
}