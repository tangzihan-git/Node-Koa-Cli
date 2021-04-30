module.exports = function() {

    return `
module.exports = {
    modelName:'eg',
    fields: {
        name: {
            type: "String",
            isUnique: true,
        },
        sex: {
            type: "String",
        },
        phone: {
            type: "String",
            isUnique: true
        }
    },
    actions: {
        create: {
            fields: ['name','sex','phone']
        },
        remove: {
            by: ['id','name']
        },
        update: {
            by: ['id'],
            fields: ['name','sex','phone']
        },
        find: {
            by:['id','name','phone','name,password']
        }
    },
    other: {
        uniqueDesc:'账户已经存在'
    }
}`
}