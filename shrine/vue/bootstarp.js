const webpack = require ("../../lib/webpack.js")
const options = require ("./webpack.config.js")
const fs = require ("fs")
const compiler = webpack (options)

compiler.run ((err, stats) => {
	console.log (stats.toString ({
		colors: true // 在控制台展示颜色
	}))
})
