const chokidar = require('chokidar')
const colors = require('colors')
const path = require('path')

class Osterman {
  constructor (filepath, ignored) {
    this.filepath = filepath
    
    ignored = path.join(process.cwd(), ignored)
    
    const watcher = chokidar.watch(process.cwd(), { ignored })
    watcher.on('ready', () => {
      watcher.on('all', () => this.restart.bind(this)())
    })
  }

  restart () {
    console.group(`\nRestarting Osterman ...`.green)

    console.log(`Clearing cache of ${Object.keys(require.cache).length} files ...`.green)
    Object.keys(require.cache).forEach(id => {
      if (id === __filename) {
        require.cache[__filename].exports = this
        return
      }
      delete require.cache[id]
    })

    console.log(`Reloading ${this.filepath} ...\n`.green)
    console.groupEnd()
    console.log(this.filepath)
    require.main.require(this.filepath)
  }
}

let osterman

module.exports.watch = (filepath, options) => {
  osterman = new Osterman(filepath, options)
  osterman.restart()
}

module.exports.restart = () => {
  osterman.restart()
}