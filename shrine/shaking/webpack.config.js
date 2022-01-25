const path = require ("path")
module.exports = {
  entry: path.resolve (__dirname, "index1.js"),
  output: {
    path: path.resolve (__dirname, "dist")
    // filename: 'my-first-webpack.bundle.js'
  },
  // mode: "production",
  mode: "development",
  // devtool:'source-map',
  optimization: {
    usedExports: true, //启用模块标记
    minimize:true,//启用terserPlugin
    concatenateModules: true  //scope hosting
  },
  stats: {
    // Examine all modules
    maxModules: Infinity,
    // Display bailout reasons
    optimizationBailout: true,
  }
}
