const express = require("express");
const app = express();
const axios = require("axios");
const connect = require("./mongoUtil");
var cors = require("cors");
const path = require("path");
const port = process.env.PORT || 7000;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "./client")));
connect
  .connect()
  .then(() => {
    app.listen(port, () => {});
    require("./routes")(app);
  })
  .catch((err) => {});
