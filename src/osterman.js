const chokidar = require('chokidar')
const path = require('path')
const util = require('util')

function log (...args) {
  args.unshift('\u001b[32m')
  args.push('\u001b[39m')
  console.log.apply(console, args)
}

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
    log(`Restarting Osterman ...`)
    process.emit('ostermanRestarting')
    
    if (event && path) log(`For ${event} to ${path}`)
    
    log(`Removing cache of ${Object.keys(require.cache).length} files ...`)
    Object.keys(require.cache).forEach(id => {
      if (id === __filename) {
        require.cache[__filename].exports = this
        require.cache[__filename].children = []
        return
      }
      delete require.cache[id]
    })

    log(`Reloading ${this.filepath} ...`)

    process.emit('ostermanRestarted')
    require(this.filepath)
  }
}

module.exports.watch = (filepath, options) => {
  const osterman = new Osterman(filepath, options)
  osterman.restart()
  return osterman
}

