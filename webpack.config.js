const webpack = require('webpack');

module.exports = {
  entry: ["./assets/main.js"],
  output: {
    filename: "./assets/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      }
    ]
  },
  devtool: "source-map"
}
