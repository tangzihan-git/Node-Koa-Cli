const packageJson = require('../../package.json')
// console.log(packageJson.version)

const welcome = `<div style='text-align:center'><h1> Welcome to ${packageJson.name} </h1><h2>Version:${packageJson.version}</h2> </div>`

module.exports = function({routers,controllers}) {
let modelTemplate = `const Router = require('koa-router');
const router = new Router();
${controllers}
router.get('/',(ctx, next )=>{
    ctx.body="${welcome}"
});
${routers}
module.exports = {
    router
}`
    
    return modelTemplate
}