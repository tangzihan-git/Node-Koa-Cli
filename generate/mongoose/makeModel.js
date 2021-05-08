const { firstWordToUppercase } = require('../../lib/common')
function generateModelMethods(model) {
    const classModelName = firstWordToUppercase(model.modelName).trim();
    const commonModelName = model.modelName.toLowerCase().trim();
 
    let methods = ``;
    if(model.actions.create){
        methods += `static async create${classModelName}(obj) {
            return new Promise(async (res,rej)=> {
                const ${commonModelName} = new ${classModelName}(obj)
                ${commonModelName}.save((err,car)=>{
                    if(err){
                        rej(err)
                    }else{
                        res(car)
                    }
                })
            })
        }\n`
    }
    if(model.actions.remove) { 
      model.actions.remove.by.forEach(el=> {
          
        methods += `
        static async remove${classModelName}By${ el=='_id' ? 'Id': firstWordToUppercase(el)}(${el}) {
            const ${el}s = ${el}.split(',')
            return new Promise(async (res,rej) => {
                const ${commonModelName} = await this.deleteMany( { ${el}: {$in:${el}s } });
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
        model.actions.remove.by.forEach(el=> {
        methods += `
        static async update${classModelName}By${ el=='_id' ? 'Id': firstWordToUppercase(el)}(${el},obj) {
            return new Promise(async (res,rej) => {
                const ${commonModelName} = await this.updateMany({ ${el} }, obj);
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
        static async get${classModelName}By${ el=='_id' ? 'Id': firstWordToUppercase(el)}(${el}, pg=1) {
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
    if(model.hasOwnProperty('foreign')){
        model.foreign.forEach(item => {
            // 
            methods +=`
        static async  get${classModelName}By${firstWordToUppercase(item.onModel)}(pg=1,${item.key}) {
            return new Promise(async (res,rej)=> {
                const ${commonModelName} =  await makePageData(pg, ${classModelName}, { ${item.key} })
                if(${commonModelName}.allCount > 0){
                    res(${commonModelName})
                }else{
                    res(undefined)
                }
            })
        }\n`
        })
    }


    }

    return methods
}

module.exports = {
    generateModelMethods,
}