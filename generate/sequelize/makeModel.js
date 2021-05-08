const { firstWordToUppercase }= require('../../lib/common')
function generateModelMethods(model) {
    const classModelName = firstWordToUppercase(model.modelName).trim();
    const commonModelName = model.modelName.toLowerCase().trim();
    let methods = ``;
    if(model.actions.create){
        methods += `
        static async create${classModelName}(obj) {
            return new Promise(async (res,rej)=> {
                try{
                    const ${commonModelName} = await this.create(obj)
                    if(${commonModelName}.id){
                        res(${commonModelName}.toJSON())
                    }else{
                        rej('创建失败')
                    }
                }catch(error){
                    console.log('error',error)
                }
            })
        }\n`
    }
    if(model.actions.remove) { 
      model.actions.remove.by.forEach(el=> {
          methods += `
        static async remove${classModelName}By${firstWordToUppercase(el)}(${el}) {
            const ${el}s = ${el}.split(',')
            return new Promise(async (res,rej) => {
                try{
                    const ${commonModelName} = await this.destroy({ where: { ${el}:{ [Op.in]:${el}s } } });
                    if(${commonModelName}){
                        res(${commonModelName})
                    }else{
                        rej('删除失败')
                    }
                }catch(error){
                    console.log('error',error)
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
                try{
                    const ${commonModelName} = await this.update(obj, { where:{ ${el} }});
                    if(${commonModelName}){
                        res(${commonModelName})
                    }else{
                        rej('更新失败')
                    }
                }catch(error){
                    console.log('error',error)
                }
               
            })
        }\n`
    })
    }
    if(model.actions.find) {
        methods += `
        static async get${classModelName}(pg=1){
            return new Promise(async (res,rej)=> {
                try{
                    const ${commonModelName} = await makePageData(pg, ${classModelName})
                    if(${commonModelName}.allCount > 0){
                        res(${commonModelName})
                    }else{
                        res(undefined)
                    }
                }catch(error){
                    console.log('error',error)
                }
               
            })
        }\n`
    model.actions.find.by.forEach(el=> {
        if(el.includes(",")){
            let afterFix = firstWordToUppercase(el.replace(",", " And ")).replace(/\s*/g,"")
            methods += `
        static async get${classModelName}By${afterFix}(${el}, pg=1) {
            return new Promise(async (res,rej)=> {
                try{
                    const ${commonModelName} = await makePageData(pg, ${classModelName},{ ${el} })
                    if(${commonModelName}.allCount > 0){
                        res(${commonModelName})
                    }else{
                        res(undefined)
                    }
                }catch(error){
                    console.log('error',error)
                }
                
            })
        }\n`
        }else{
            methods += `
        static async get${classModelName}By${firstWordToUppercase(el)}(${el}, pg=1) {
            return new Promise(async (res,rej)=> {
                try{
                    const ${commonModelName} = await makePageData(pg, ${classModelName},{ ${el} })
                    if(${commonModelName}.allCount > 0){
                        res(${commonModelName})
                    }else{
                        res(undefined)
                    }
                }catch(error){
                    console.log('error',error)
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
                try{
                    const ${commonModelName} =  await makePageData(pg, ${classModelName}, { ${item.key} })
                    if(${commonModelName}.allCount > 0){
                        res(${commonModelName})
                    }else{
                        res(undefined)
                    }
                }catch(error){
                    console.log('error',error)
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