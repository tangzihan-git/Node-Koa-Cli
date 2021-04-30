module.exports = function(methods) {
return `const db = require('../models/index');
const RetJson  = require('../lib/retjson');
module.exports = {
    ${methods}
}`
}

