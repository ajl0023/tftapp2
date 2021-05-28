const express = require("express");
const app = express();
const axios = require("axios");
const connect = require("./mongoUtil");
var cors = require("cors");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

connect
  .connect()
  .then(() => {
    app.listen(5000, () => {
      console.log("connected to port 5000");
    });
    require("./routes")(app);
  })
  .catch((err) => {
    console.log(err);
  });
