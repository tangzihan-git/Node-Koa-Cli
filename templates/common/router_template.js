const packageJson = require('../../package.json')
// console.log(packageJson.version)

const welcome = `<div style='text-align:center'><h1> Welcome to ${packageJson.name} </h1><h2>Version:${packageJson.version}</h2> </div>`

module.exports = function({routers,controllers}) {
let modelTemplate = `const Router = require('koa-router');
const router = new Router();
const AppController = require('../controllers/app.js');
${controllers}
router.get('/',(ctx, next )=>{
    ctx.body="${welcome}"
});
router.post('/upload', AppController.updateFile);
${routers}
module.exports = {
    router
}`
    
    return modelTemplate
}