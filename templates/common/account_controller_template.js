module.exports = function(){
return `
const RetJson  = require('../lib/retjson');
const { User } = require('../models/index');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const jwtSecret = 'sgfe3%72ef*HYERgtrh';
module.exports = {
  async login(ctx) {
    let user = await User.getUserByEmailAndPassword(ctx.request.body.email,md5(ctx.request.body.password));
    if(!user){
      return  ctx.body = new RetJson(403, '用户名或密码错误')
    }
    // 验证成功下发token
    const authToken = jwt.sign(JSON.parse(JSON.stringify(user.data[0])), jwtSecret, { expiresIn: '2d' });
    ctx.body = new RetJson(200, 'success', {user,authToken})
}
}
`
} 