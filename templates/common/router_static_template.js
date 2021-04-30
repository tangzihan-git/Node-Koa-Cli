
module.exports = function() {
    let modelTemplate = `const static = require('koa-static');
module.exports = function(router,options){
    options = options||{};
    options.image = options.image||30;
    options.script = options.script||1;
    options.styles = options.styles||30;
    options.html = options.html||30;
    options.other = options.othre||7;
    router.all(/((\.jpg)|(\.png)|(\.gif))$/i,static('./upload/images',{
        maxAge:options.image*86400*1000
    }));
    router.all(/((\.js)|(\.jsx))$/i,static('./upload',{
        maxAge:options.script*86400*1000
    }));
    router.all(/((\.css))$/i,static('./upload',{
        maxAge:options.styles*86400*1000
    }));
    router.all(/((\.html)|(\.htm))$/i,static('./upload',{
        maxAge:options.html*86400*1000
    }));
    router.all(/\\*/,static('./upload',{
        maxAge:options.other*86400*1000
    }))
}`
    
    return modelTemplate
}
