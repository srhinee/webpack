const path = require("path");
const VueLoaderPlugin = require("vue-loader").VueLoaderPlugin;
module.exports = {
	entry: path.resolve(__dirname, "a.js"),
	output: {
		path: path.resolve(__dirname, "dist")
		// filename: 'my-first-webpack.bundle.js'
	},
	mode: "production",
	module: {
		rules: [
			{ test: /\.vue$/, use: "vue-loader" },
			{ test: /\.css$/, use: ["style-loader", "css-loader"] }
		]
	},
	plugins: [new VueLoaderPlugin()]
};
