const { firstWordToUppercase }= require('../../lib/common')

module.exports.commonModel = function(model,methods) {
    const classModelName = firstWordToUppercase(model.modelName)
    let field = {}
    let res = `\n    {`
    for(item in model.fields){
        let str = `\n        ${item}:DataTypes.${model.fields[item].type.toUpperCase()},`
        res+=str
    }
    res+='\n    }'
    let modelTemplate = `const { makePageData }= require('../lib/common.js')
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ${classModelName} extends Model {
        static associate(models) {
        // define association here
        }
        ${methods}
    };
    
    ${classModelName}.init(${res}, {
        sequelize,
        modelName: "${classModelName}",
    });
    return ${classModelName};
};`
return modelTemplate
}


module.exports.indexModel = function() {
    return `
'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.pass, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// 模型同步
sequelize.sync({alter: true }).then(res=>{
  console.log("All models were successfully synchronized")
})
module.exports = db;`
}

