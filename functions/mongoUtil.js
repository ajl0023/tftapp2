const MongoClient = require("mongodb").MongoClient;
let connection;
let client;
let matchesdb;
let roundsdb;
let usersdb;
let db;
const url =
  "mongodb+srv://a:a@cluster0.2e6a1.mongodb.net/spotify-playlists?retryWrites=true&w=majority";
module.exports = {
  connect: async () => {
    connection = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = connection;
    return connection;
  },
  getdb: function () {
    return db;
  },
  getMatchesdb: function () {
    matchesdb = connection.db("tft-matches").collection("matches");
    return matchesdb;
  },
  getRoundsdb: function () {
    roundsdb = connection.db("tft-matches").collection("rounds");
    return roundsdb;
  },
  getUsersdb: function () {
    usersdb = connection.db("tft-matches").collection("users");
    return usersdb;
  },
  disconnect: async function () {
    await connection.close();
  },
};
