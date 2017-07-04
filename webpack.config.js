const webpack = require('webpack');

module.exports = {
  entry: ["./main.js"],
  output: {
    filename: "./bundle.js",
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
