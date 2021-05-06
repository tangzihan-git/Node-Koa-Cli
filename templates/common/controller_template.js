module.exports = function(model,methods) {
return `const { ${ model } } = require('../models/index');
const RetJson  = require('../lib/retjson');
module.exports = {
    ${methods}
}`
}

