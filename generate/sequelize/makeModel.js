const { firstWordToUppercase }= require('../../lib/common')
function generateModelMethods(model) {
    const classModelName = firstWordToUppercase(model.modelName);
    const commonModelName = model.modelName.toLowerCase();
    let methods = ``;
    if(model.actions.create){
        methods += `
        static async create${classModelName}(obj) {
            return new Promise(async (res,rej)=> {
                const ${commonModelName} = await this.create(obj)
                if(${commonModelName}.id){
                    res(${commonModelName}.toJSON())
                }else{
                    rej('创建失败')
                }
            })
        }\n`
    }
    if(model.actions.remove) { 
      model.actions.remove.by.forEach(el=> {
          methods += `
        static async remove${classModelName}By${firstWordToUppercase(el)}(${el}) {
            return new Promise(async (res,rej) => {
                const ${commonModelName} = await this.destroy({ where: { ${el}:{ [Op.in]:${el} } } });
                if(${commonModelName}){
                    res(${commonModelName})
                }else{
                    rej('删除失败')
                }
            })

        }\n`
      });
    }
    if(model.actions.update) {
        model.actions.update.by.forEach(el=> {
            methods += `
            static async update${classModelName}By${firstWordToUppercase(el)}(${el},obj) {
            return new Promise(async (res,rej) => {
                const ${commonModelName} = await this.update(obj, { ${el} });
                if(${commonModelName}){
                    res(${commonModelName})
                }else{
                    rej('更新失败')
                }
            })
        }\n`
    })
    }
    if(model.actions.find) {
        methods += `
        static async get${classModelName}(pg=1){
            return new Promise(async (res,rej)=> {
                const ${commonModelName} = await makePageData(pg, ${classModelName})
                if(${commonModelName}.allCount > 0){
                    res(${commonModelName})
                }else{
                    res(undefined)
                }
            })
        }\n`
    model.actions.find.by.forEach(el=> {
        if(el.includes(",")){
            let afterFix = firstWordToUppercase(el.replace(",", " And ")).replace(/\s*/g,"")
            methods += `
        static async get${classModelName}By${afterFix}(${el}, pg=1) {
            return new Promise(async (res,rej)=> {
                const ${commonModelName} = await makePageData(pg, ${classModelName},{ ${el} })
                if(${commonModelName}.allCount > 0){
                    res(${commonModelName})
                }else{
                    res(undefined)
                }
            })
        }\n`
        }else{
            methods += `
        static async get${classModelName}By${firstWordToUppercase(el)}(${el}, pg=1) {
            return new Promise(async (res,rej)=> {
                const ${commonModelName} = await makePageData(pg, ${classModelName},{ ${el} })
                if(${commonModelName}.allCount > 0){
                    res(${commonModelName})
                }else{
                    res(undefined)
                }
            })
        }\n`
        }
        
    })


    }

    return methods
}



module.exports = {
    generateModelMethods,
}