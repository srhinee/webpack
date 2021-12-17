const fs = require ('fs')

module.exports = class webpackModuleCounterPlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync ('webpackModuleCounterPlugin', function(stat, callback) {
      const obj = stat.toJson ()
      fs.writeFile ('stat.json', JSON.stringify ({
        time:obj.time,
        moduleNums: obj.modules.length,
        chunkNums:obj.chunks.length
      }), function(err) {console.warn (err)})
      callback()
    })
  }
}

