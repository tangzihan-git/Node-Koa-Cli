
module.exports = function(options) {
let modelTemplate = `const Koa = require('koa');
const koaBody = require('koa-body');
const RetJson  = require('./lib/retjson');
const { router } = require('./router');
const cors = require('koa2-cors');
const static = require('./router/static');

const app = new Koa();

// post 解析
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 10 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
}));

// 全局错误捕获
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof Error) {
            ctx.body = new RetJson(err.status, err.message);
        } else {
            ctx.body = new RetJson(500, '遇到故障，我们会尽快修复');
        }
    }
});
app.use(cors());
static(router,{html:365});
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8081, (err) => {
    if (err) {
        console.error('服务启动失败', err);
        return;
    }

    console.warn('server listening on port 8081');
    console.warn('server running, god bless love...');
});`
    
    return modelTemplate
}
