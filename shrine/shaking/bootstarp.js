const webpack = require("../../lib/webpack.js");
const options = require("./webpack.config.js");

const compiler = webpack(options);

compiler.run((err, stats) => {
	console.log("done");
	console.log(
		stats.toString({
			chunks: false, // 使构建过程更静默无输出
			colors: true // 在控制台展示颜色
		})
	);
});
