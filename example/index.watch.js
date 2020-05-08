// Require Osterman  
// Osterman is cached so subsequent requires will get the same object
const osterman = require('../src/osterman')

// Start Osterman
// Osterman runs in the context of process.cwd() so paths should be relative
// to path where you start your application.
osterman.watch('./example/index.js',  './example/ignored/*.*')

// For demonstration ... restart the application.
setTimeout(() => { 
  const demo = require('../src/osterman')
  demo.on('restarting', () => { console.log('\n[Handle "restarting"]') })
  demo.on('removing', () => { console.log('\n[Handle "removing"]\n') })
  demo.on('reloading', () => { console.log('\n[Handle "reloading"]\n') })
  demo.on('restarted', () => { console.log('\n[Handle "restarted"]\n') })
  demo.restart() 
}, 1000)