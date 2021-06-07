let {dependencies, devDependencies} = require('./packageJson.json')
module.exports = function(name,argObj) {
    devDependencies[`${require('../package.json').name}`] = `^${require('../package.json').version}` // 开发依赖库
    // if(argObj.static) {
        dependencies['koa-static'] =  "^5.0.0"
    // }
    switch (argObj.lib) {
        case 'mongoose':
            dependencies['mongoose'] = "^5.12.3";
            break;
        case 'sequelize':
            dependencies['sequelize'] = "^6.6.2";
            dependencies['mysql2']  =  "^2.2.5",
            devDependencies['sequelize-cli'] = "^6.2.0"
        default:
            break;
    }
    return `
{
    "name": "${name}",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
        "test": "echo \\"Error: no test specified\\" && exit 1",
        "start:dev": "nodemon ./app.js"
    },
    "repository": {
        "type": "git",
        "url": ""
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies":${JSON.stringify(dependencies,null, 8)},
    "devDependencies":${JSON.stringify(devDependencies,null, 8)}
}`

}