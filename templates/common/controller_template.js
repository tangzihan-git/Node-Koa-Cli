module.exports = function(model,methods) {
return `const { ${ model } } = require('../models/index');
const RetJson  = require('../lib/retjson');
${ (model == 'user' || model == 'User') ? "const md5 = require('md5');": "" }
module.exports = {
    ${methods}
}`
}

