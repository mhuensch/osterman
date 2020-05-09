const chokidar = require('chokidar')
const colors = require('colors')
const path = require('path')

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
    console.group(`\nRestarting Osterman ...`.green)
    process.emit('ostermanRestarting')
    
    if (event && path) console.log(`For ${event} to ${path}`.green)
    
    console.log(`Removing cache of ${Object.keys(require.cache).length} files ...`.green)
    Object.keys(require.cache).forEach(id => {
      if (id === __filename) {
        require.cache[__filename].exports = this
        require.cache[__filename].children = []
        return
      }
      delete require.cache[id]
    })

    console.log(`Reloading ${this.filepath} ...`.green)
    console.groupEnd()

    process.emit('ostermanRestarted')
    require(this.filepath)
  }
}

module.exports.watch = (filepath, options) => {
  const osterman = new Osterman(filepath, options)
  osterman.restart()
  return osterman
}

