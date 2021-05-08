module.exports = function() {
return `const RetJson  = require('../lib/retjson');
const { uploader } = require('../lib/util');
module.exports = { 
    async updateFile(ctx){
       let res = await uploader(ctx.request.files.file)
       ctx.body = new RetJson('success', res,200)

    }
}`
}