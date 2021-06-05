// const express = require("express");
// const app = express();
// const axios = require("axios");
// const connect = require("./mongoUtil");
// var cors = require("cors");
// const path = require("path");

// app.use(cors());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.static(path.join(__dirname, "../tftapp/build")));
// connect
//   .connect()
//   .then(() => {
//     app.listen(7001, () => {});
//     require("./routes")(app);
//   })
//   .catch((err) => {});
const express = require("express");

const app = express();
app.use(express.static(path.join(__dirname, "./client")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./client", "index.html"))
);

app.get("/about", (req, res) => res.send("About Page Route"));

app.get("/portfolio", (req, res) => res.send("Portfolio Page Route"));

app.get("/contact", (req, res) => res.send("Contact Page Route"));

const port = process.env.PORT || 7000;

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
