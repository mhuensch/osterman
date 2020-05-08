const osterman = require('../src/osterman')
osterman.watch('./index.js',  './example/ignored/*.*')
setTimeout(() => { osterman.restart() }, 1000)