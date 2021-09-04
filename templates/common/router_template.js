const packageJson = require('../../package.json')
// console.log(packageJson.version)

const welcome = `<div style='text-align:center'><h1> Welcome to ${packageJson.name} </h1><h2>Version:${packageJson.version}</h2> </div>`

module.exports = function({routers,controllers},options) {
let modelTemplate = `const Router = require('koa-router');
const router = new Router();
const appController = require('../controllers/app.js');
const accountController = require('../controllers/account.js');

${controllers}
router.get('/',(ctx, next )=>{
    ctx.body="${welcome}"
});
router.post('/upload', appController.updateFile);
router.post('/login', accountController.login);
${routers}
module.exports = {
    router
}`
    
    return modelTemplate
}