const path = require('path')
const fs = require('fs')
const file = require('../index')
module.exports  = function (){
    copyIt('../templates/client/babel.config.js','1.js')
}

function copyIt(from, to) {
    fs.createReadStream(from).pipe(fs.createWriteStream(to));
  }
   