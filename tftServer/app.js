const express = require("express");
const app = express();
const axios = require("axios");
const connect = require("./mongoUtil");
var cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "../tftapp/build")));
connect
  .connect()
  .then(() => {
    app.listen(7000, () => {});
    require("./routes")(app);
  })
  .catch((err) => {});
