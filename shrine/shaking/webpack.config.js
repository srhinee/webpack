const path = require("path");
module.exports = {
	entry: path.resolve(__dirname, "index1.js"),
	output: {
		path: path.resolve(__dirname, "dist")
		// filename: 'my-first-webpack.bundle.js'
	},
	// mode: "production",
	mode: "development",
	optimization: {
		usedExports: true,
	}
};
