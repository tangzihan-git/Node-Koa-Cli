module.exports = function(type) {
    let IntegerType = type == 'mongodb' ? 'Number' : 'Integer';
    return `
module.exports = {
    modelName:'user', // 用户模型
    fields: {
        nick: {
            type: "String",
            isUnique: true,
        },
        email:{
            type:"String",
            isUnique: true,
        },
        password:{
            type:"String"
        },
        verify_token:{
            type:"String"
        },
        status:{
            type:"${IntegerType}"
        },
        type:{
            type:"${IntegerType}" // 用户组别
        },
        cover:{
            type:"String"
        }
        
    },
    actions: {
        create: {
            fields: ['nick','email','password','verify_token','status','type','cover']
        },
        remove: {
            by: ['id']
        },
        update: {
            by: ['id'],
            fields:['nick','email','password','verify_token','status','type','cover']
        },
        find: {
            by:['id','nick','email','email,password']
        }
    },
    other: {
        uniqueDesc:'账户已经存在'
    }
}`
}