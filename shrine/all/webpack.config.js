const path = require ("path")
module.exports = {
  entry: {
    'index': path.resolve (__dirname, "index.js")
  },
  output: {
    path: path.resolve (__dirname, "dist")
    // filename: 'my-first-webpack.bundle.js'
  },
  // mode: "production",
  mode: "development",
  module: {
    rules: [
      {test: /\.css$/, use: ["style-loader", "css-loader"]}
    ]
  },
}
