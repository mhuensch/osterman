const chokidar = require('chokidar')
const path = require('path')
const { green, red } = require('@mhuensch/jubilee')

class Osterman {
  constructor (filepath, ignored) {
    this.filepath = path.join(process.cwd(), filepath)
    ignored = path.join(process.cwd(), ignored)
    
    const watcher = chokidar.watch(process.cwd(), { ignored })
    watcher.on('ready', () => {
      watcher.on('all', (event, path) => this.restart.bind(this)(event, path))
    })
  }

  restart (event, path) {
    console.log(green(`Restarting Osterman ...`))
    if (event && path) console.log(green(`For ${event} to ${path} ...`))
    
    process.emit('ostermanRestarting')
    
    console.log(green(`Removing cache of ${Object.keys(require.cache).length} files ...`))
    Object.keys(require.cache).forEach(id => {
      if (id === __filename) {
        require.cache[__filename].exports = this
        require.cache[__filename].children = []
        return
      }
      delete require.cache[id]
    })

    console.log(green(`Reloading ${this.filepath} ...`))

    process.emit('ostermanRestarted')
    try {
      require(this.filepath)
    } catch (err) {
      console.error(red(err.stack))
    }
  }
  
  log (...args) {
    args.unshift('\u001b[32m')
    args.push('\u001b[39m')
    _log.apply(console, args)
  }
}

module.exports.watch = (filepath, options) => {
  const osterman = new Osterman(filepath, options)
  osterman.restart()
  return osterman
}

