const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  CopyPlugin = require("copy-webpack-plugin"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => ({
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  entry: "./main.js",

  mode: "development",

  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].js",
  },
  plugins: [
    // new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: path.resolve(__dirname, "./dist/main.html"),
    }),
  ],
});
