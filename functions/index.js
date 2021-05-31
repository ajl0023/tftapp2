const express = require("express");
const app = express();
const axios = require("axios");
const functions = require("firebase-functions");

const connect = require("./mongoUtil");
var cors = require("cors");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

connect
  .connect()
  .then(() => {
    app.listen(5000, () => {});
    require("./routes")(app);
  })
  .catch((err) => {});
exports.app = functions.https.onRequest(app);
