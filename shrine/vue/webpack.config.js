const path = require ("path")
const VueLoaderPlugin = require ("./vue-loader").VueLoaderPlugin
module.exports = {
	entry: path.resolve (__dirname, "index.js"),
	output: {
		path: path.resolve (__dirname, "dist")
		// filename: 'my-first-webpack.bundle.js'
	},
	// mode: "production",
	mode: "development",
	module: {
		rules: [
			{test: /\.vue$/, use: "vue-loader"},
			{
				test: /\.pug$/,
				loader: 'pug-plain-loader'
			},
			{
				test: /\.less$/,
				use: [{
					loader: 'style-loader' // creates style nodes from JS strings
				}, {
					loader: 'css-loader' // translates CSS into CommonJS
				}, {
					loader: 'less-loader' // compiles Less to CSS
				}]
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	plugins: [new VueLoaderPlugin ()]
}
