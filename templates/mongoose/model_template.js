const { firstWordToUppercase }= require('../../lib/common')
module.exports.commonModel = function(model,methods) {
const classModelName = firstWordToUppercase(model.modelName)
let res = `\n    {`
for(item in model.fields){
    let str = `\n        ${item}:${model.fields[item].type},`
    res+=str
}
res+='\n    }'

return `const mongoose = require('mongoose');
const { makePageData } = require('../lib/common');
const ${classModelName}Model = mongoose.model('${model.modelName.toLowerCase()}', mongoose.Schema(${res}\n))
module.exports = ()=> {
    class ${classModelName} extends ${classModelName}Model {
        ${methods}
    }
    return ${classModelName}
}`

}

module.exports.indexModel = function(){
        return `
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
let mongooPool = null
async function getConnection() {
    return new Promise((res, rej)=> {
    mongoose.connect('mongodb://'+config.host,{
        user:config.user,
        pass:config.pass,
        dbName:config.database, 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize:90
    });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        return res(db)
    });

    })
}

getConnection().then(res=>{
    mongooPool = res
})


fs
  .readdirSync(__dirname)
  .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
  .forEach(file => {
      const model = require(path.join(__dirname, file))(); // 引入model文件
      db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
});

db.mongoose = mongooPool;
module.exports = db;`
}





