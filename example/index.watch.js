// Require Osterman  
// Osterman is cached so subsequent requires will get the same object
const osterman = require('../src/osterman')
const watch = osterman.watch('./example/index.js',  './example/ignored/*.*')

// For demonstration ... restart the application.
setTimeout(() => { 
  watch.restart() 
}, 1000)