const MongoClient = require("mongodb").MongoClient;
let connection;
let client;
let matchesdb;
let playlistdb;
let db;
const url =
  "mongodb+srv://a:a@cluster0.2e6a1.mongodb.net/spotify-playlists?retryWrites=true&w=majority";
module.exports = {
  connect: async () => {
    connection = await MongoClient.connect(url, { useUnifiedTopology: true });
    return connection;
  },
  getMatchesdb: function () {
    matchesdb = connection.db("tft-matches").collection("matches");
    return matchesdb;
  },

  disconnect: async function () {
    await connection.close();
  },
};
