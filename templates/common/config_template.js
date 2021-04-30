module.exports = function(options) {
    return `const path = require('path')
module.exports = {
    name:'',
    ConfigModelRoot:path.resolve(__dirname,'./config/model'),
    DataBaseLib:'${options.lib}', // mongoose // sequelize
    StaticRouter:${options.static}
}`

}

