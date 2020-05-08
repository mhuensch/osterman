# Osterman
A simple monitoring script for reloading Node.js applications

### Quickstart
Install the package ...
``` 
npm install @mhuensch/osterman
```

Create a script to control Osterman (i.e. index.watch.js) ... 
``` js
// Require Osterman  
// Osterman is cached so subsequent requires will get the same object
const osterman = require('../src/osterman')

// Start Osterman
// Osterman runs in the context of process.cwd() so paths should be relative
// to path where you start your application.
osterman.watch('./example/index.js',  './example/ignored/*.*')
```

Run node as you normally would but swapping index.watch.js for index.js when you want to reload automatically ...
```
node example/index.watch
```

Hook into Osterman events as needed.
``` js
const osterman = require('../src/osterman')
osterman.on('restarting', () => { console.log('\n[Handle "restarting"]') })
osterman.on('removing', () => { console.log('\n[Handle "removing"]\n') })
osterman.on('reloading', () => { console.log('\n[Handle "reloading"]\n') })
osterman.on('restarted', () => { console.log('\n[Handle "restarted"]\n') })
```
*NOTE: this require and registration must occur AFTER osterman has run for the first time as Osterman will not have been registered as an object until that point.*

### Motivation
Yes, there are a lot of packages out there that basically accomplish the same goal. Forever, Nodemon, Pm2, and Supervisor all basically do the same thing; but their goals are different and this is reflected in their implementation.  They were all much *heavier* than I would like involving increased setup time and reload time.

I wanted a very **simple** script that I could use - **during devlopment** - to reload applications as I change them.  I wanted the ability to control this process through code and I wanted it to be **fast**!

### Implementation
Osterman reloads applications by clearing the Node.js cache and "restarting" the application by re-requiring the root file.  This is a very opinionated approach to restarting a Node.js application and will not work for all implementations.  It is not recommended for production use or for large applications with complex interactions, however, for simple and small hobby projects its use is really straight forward.

Osterman overcomes some of it's limitations by emitting notifications from the reload process.  This allows applications to listen and respond to the process accordingly (i.e. removing listeners, saving state, etc.)

### Osterman?
In the graphic novel "Watchmen", Doctor Manhattan's real name is "Jon Osterman".

### Development
To create a local npm pacakge for Osterman, in the source code directory run:
```
npm link
```

Then include that pacakge in your test or demo project by running:
```
npm link [example project]
```

To publish to npm under a personal account run:
```
npm publish --access public
```