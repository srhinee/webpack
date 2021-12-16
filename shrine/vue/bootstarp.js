const webpack = require ("../../lib/webpack.js")
const options = require ("./webpack.config.js")
const fs = require ("fs")
const compiler = webpack (options)

compiler.run ((err, stats) => {
	fs.writeFile ('dist/stat.json', JSON.stringify(stats.toJson ()) , function (err) {
		console.log (err)
	})
	stats.toString ({
		colors: true // 在控制台展示颜色
	})
})
