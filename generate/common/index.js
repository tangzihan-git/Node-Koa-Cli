const { firstWordToUppercase, getUniqueFiled }= require('../../lib/common')

module.exports = {
    // 控制器方法生成器
    generateControllerMethods(model) {
        const classModelName = firstWordToUppercase(model.modelName);
        const commonModelName = model.modelName.toLowerCase();
        
        let methods = ``;
        if(model.actions.create){
            // 拼接请求参数
            let str = `{`
            model.actions.create.fields.forEach(item=>{
                str +=   `\n            ${item}: ctx.request.body.${item},`
            })
            str+=`\n        }`
    
            let arr = getUniqueFiled(model.fields) // 获取配置文件中的唯一属性字段
            if( arr.length > 0 ) {
                // 根据唯一字段数组生成验证方法
                let verifyMethods = ``
                arr.forEach(item=>{
                    // 出现唯一字段时，判断用户是否在 find.by 数组添加了对应的方法
                    if( !model.actions.find.by.includes(item)) {
                        throw Error(`\n错误：唯一字段${item}必须添加到actions.find.by数组中\nError: The unique field ${item} must be added to the Actions.find.by array`)
                    }
                    verifyMethods += ` await  db.${classModelName}.get${classModelName}By${firstWordToUppercase(item)}(ctx.request.body.${item}) || `
                })
                // 去掉末尾的 || 运算符
                verifyMethods = verifyMethods.substring(0,verifyMethods.lastIndexOf('||'))
                // 字段重复时的提示文字
                let uniqueDesc = model.other.uniqueDesc ? model.other.uniqueDesc : '数据重复！' 
                // 添加字段唯一性验证规则
                methods += `
    async store(ctx) {
        if(${verifyMethods}){
            ctx.body = new RetJson(403, '${uniqueDesc}')
            return;
        }
        const ${commonModelName} = await db.${classModelName}.create${classModelName}(${str})
        ctx.body = new RetJson('success',${commonModelName})
    },\n`
            }else{
                methods += `
    async store(ctx) {
        const ${commonModelName} = await db.${classModelName}.create${classModelName}(${str})
        ctx.body = new RetJson('success',${commonModelName})
    },\n`
            }
        }
        if(model.actions.remove) { 
            // model.actions.remove.by.forEach(el=> {
                methods += `
    async destory(ctx) {
        const ${commonModelName} = await db.${classModelName}.remove${classModelName}ById(ctx.query.id)
        ctx.body = new RetJson('success',${commonModelName})
    },\n`
            // });
        }
        if(model.actions.update) {
            // model.actions.update.by.forEach(el=> {
        let str = `{`
        model.actions.update.fields.forEach(item=>{
            str +=   `\n            ${item}: ctx.request.body.${item},`
        })
        str+=`\n        }`
        methods += `
    async update(ctx) {
        const ${commonModelName} = await db.${classModelName}.update${classModelName}ById(ctx.params.id,${str})
        ctx.body = new RetJson('success',${commonModelName})
    },\n`
            // });
        }
        if(model.actions.find) {
            methods += `
    async  index(ctx){
        const ${commonModelName} = await db.${classModelName}.get${classModelName}(ctx.query.pg)
        ctx.body = new RetJson('success',${commonModelName})
    },\n`
        // if(model.actions.find.by.includes('id')) {
            methods += `
    async  show(ctx){
        const ${commonModelName} = await db.${classModelName}.get${classModelName}ById(ctx.params.id)
        ctx.body = new RetJson('success',${commonModelName})
    },\n`
        // }
        }
    
        return methods
        
    },
    // 路由文件 controller 引用 和 路由生成
    generateRouterMethods(models) {
        let controllers = '';
        let routers = '';
         models.forEach(async (f) => {
            const ctrlClass = require(f);
            let modelName = ctrlClass.modelName.toLowerCase()
            controllers += `const ${modelName}Controller = require('../controllers/${modelName}.js');\n`
            // const userController = require('../controllers/user_controller')
            routers += `
// ${modelName}
router.post('/${modelName}', ${modelName}Controller.store);
router.get('/${modelName}', ${modelName}Controller.index);
router.get('/${modelName}/:id', ${modelName}Controller.show);
router.delete('/${modelName}/', ${modelName}Controller.destory); // delete需要传入query兼容多选删除
router.put('/${modelName}/:id', ${modelName}Controller.update);\n`
        })
        return {
            routers,
            controllers
        }
    }
}