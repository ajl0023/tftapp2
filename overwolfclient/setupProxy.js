const proxy = require("http-proxy-middleware");
module.exports = function (app) {
  console.log(app);
  app.use(proxy("/auth/google", { target: "http://localhost:5000/" }));
};
