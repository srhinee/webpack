const webpack = require ("../../lib/webpack.js")
const options = require ("./webpack.config.js")
const fs = require ("fs")
const compiler = webpack (options)

compiler.run ((err, stats) => {
	const obj=stats.toJson()
	fs.writeFile ('dist/stat.json', JSON.stringify ({
		moduleNums: obj.modules.length,
		moduleIds: obj.modules.map (v => v.id)
	}), function (err) {
		console.log (err)
	})
	console.log (stats.toString ({
		colors: true // 在控制台展示颜色
	}))

})
