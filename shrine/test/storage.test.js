const NodeJsInputFileSystem = require ('enhanced-resolve/lib/NodeJsInputFileSystem')
const path = '/Users/apple/project/git/web/Origin/webpack/shrine/shaking/webpack.config.js'

class Storage {
	constructor (duration) {
		this.duration = duration
		this.running = new Map ()
		this.data = new Map ()
		this.levels = []
		if (duration > 0) {
			this.levels.push (
				new Set (),
				new Set (),
				new Set (),
				new Set (),
				new Set (),
				new Set (),
				new Set (),
				new Set (),
				new Set ()
			)
			for (let i = 8000; i < duration; i += 500) this.levels.push (new Set ())
		}
		this.count = 0
		this.interval = null
		this.needTickCheck = false
		this.nextTick = null
		this.passive = true
		this.tick = this.tick.bind (this)
		this.cur = null

		console.log (this.duration, this.levels.length, this.duration / this.levels.length)
	}

	ensureTick () {
		if (!this.interval && this.duration > 0 && !this.nextTick)
			this.interval = setInterval (
				this.tick,
				Math.floor (this.duration / this.levels.length)
			)
	}

	finished (name, err, result) {
		const callbacks = this.running.get (name)
		this.running.delete (name)
		if (this.duration > 0) {
			this.data.set (name, [err, result])
			const levelData = this.levels[0]
			this.count -= levelData.size
			levelData.add (name)
			this.cur = levelData
			this.count += levelData.size
			this.ensureTick ()
		}
		for (let i = 0; i < callbacks.length; i++) {
			callbacks[i] (err, result)
		}
	}

	finishedSync (name, err, result) {
		if (this.duration > 0) {
			this.data.set (name, [err, result])
			const levelData = this.levels[0]
			this.count -= levelData.size
			levelData.add (name)
			this.count += levelData.size
			this.ensureTick ()
		}
	}

	provide (name, provider, callback) {
		if (typeof name !== "string") {
			callback (new TypeError ("path must be a string"))
			return
		}
		console.log ('\nstart')
		let running = this.running.get (name)
		if (running) {
			running.push (callback)
			return
		}
		if (this.duration > 0) {
			this.checkTicks ()
			const data = this.data.get (name)
			if (data) {
				return process.nextTick (() => {
					console.log ('缓存获取')
					callback.apply (null, data)
				})
			}
		}
		this.running.set (name, (running = [callback]))
		provider (name, (err, result) => {
			console.log ('调用fs')
			this.finished (name, err, result)
		})
	}

	tick () {
		const decay = this.levels.pop ()
		for (let item of decay) {
			this.data.delete (item)
		}
		this.count -= decay.size
		decay.clear ()
		this.levels.unshift (decay)
		if (this.count === 0) {
			clearInterval (this.interval)
			this.interval = null
			this.nextTick = null
			console.log (5, this.levels.indexOf (this.cur))
			return true
		} else if (this.nextTick) {
			this.nextTick += Math.floor (this.duration / this.levels.length)
			const time = new Date ().getTime ()
			console.log (3, this.levels.indexOf (this.cur))
			if (this.nextTick > time) {
				this.nextTick = null
				this.interval = setInterval (
					this.tick,
					Math.floor (this.duration / this.levels.length)
				)
				console.log (4, this.levels.indexOf (this.cur))
				return true
			}
		} else if (this.passive) {
			console.log (2, this.levels.indexOf (this.cur))
			clearInterval (this.interval, this.levels)
			this.interval = null
			this.nextTick =
				new Date ().getTime () + Math.floor (this.duration / this.levels.length)
		} else {
			console.log (1, this.levels.indexOf (this.cur))
			this.passive = true
		}
	}

	checkTicks () {
		this.passive = false
		if (this.nextTick) {
			console.log ('tick')
			while (!this.tick ()) {}
		}
	}

	purge (what) {
		if (!what) {
			this.count = 0
			clearInterval (this.interval)
			this.nextTick = null
			this.data.clear ()
			this.levels.forEach (level => {
				level.clear ()
			})
		} else if (typeof what === "string") {
			for (let key of this.data.keys ()) {
				if (key.startsWith (what)) this.data.delete (key)
			}
		} else {
			for (let i = what.length - 1; i >= 0; i--) {
				this.purge (what[i])
			}
		}
	}
}

class newStorage {
	constructor (duration) {
		this.duration = duration
		this.data = new Map ()
		this.running = new Map ()
	}

	provide (path, handle, callback) {
		let data = this.data.get (path)
		let running = this.running.get (path)
		if (running) return 	running.push (callback)
		this.running.set (path, [callback])
		console.log ('start')
		if (!data) handle (path,'utf-8',(err, result) => {
			this.data.set (path, result)
			setTimeout (() => {
				this.data.delete (path)
			}, this.duration)
			console.log ('调用fs')
			for (let c of this.running.get (path)) c (err, result)
			this.running.delete(path)
		})
		else {
			callback (null, data)
			console.log ('缓存获取')
		}
	}
}


function read (duration) {
	let storage = new Storage (duration)
	// let storage = new newStorage (duration)
	let system = new NodeJsInputFileSystem ()
	return storage.provide.bind (storage, path, system.readFile, (err, result) => {
		console.log (err, result)
	})
}

let count = 1, provide = read (900)
let interval = setInterval (() => {
	count += 1
	provide ()
	if (count === 4) clearInterval (interval)
}, 100)

