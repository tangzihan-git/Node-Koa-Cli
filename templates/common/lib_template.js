module.exports = function(type) {
    let makePageData = ''
    if(type.toLowerCase == 'mongoodb'){
        makePageData  = `module.exports = {
            // 生成分页数据
            async makePageData( pg, model, where = {}) {
                // 数据总和
                const all = await model.find(where)
                const pageSize = 15
                const allCount = all.length
                const query = model.find(where)
                const skip = pageSize * (pg - 1)
                const data = await query.skip(skip).limit(pageSize)
                const isNext = data.length == pageSize
        
                return {
                    currentPage:pg,
                    allCount:allCount,
                    length:data.length,
                    data:data,
                    isNext:isNext,
                }
            }
        }`

    }else{
        // sequelize
        makePageData  = `module.exports = {
            // 生成分页数据
            async makePageData(pg, model, where = {}) {
                const pageSize = 15;
                const skip = pageSize * (pg - 1)
                const { count, rows } = await model.findAndCountAll({
                    where,
                    offset: skip,
                    limit: pageSize
                });
                const isNext = rows.length == pageSize
                return {
                    currentPage:pg,
                    allCount:count,
                    length:rows.length,
                    data:rows,
                    isNext:isNext,
                }
        
            }
        }`
    }
     
const retJson =
`class RetJson {
    constructor(errcode = 0, errmsg = '', retobj = '') {
      this.errcode = errcode;
      this.errmsg = errmsg;
      this.retobj = retobj;
    }
  }
  
module.exports = RetJson;`

const util = `
const fs = require('fs')
module.exports = {
    uploader(file,allowExt=['jpg','png','gif','jpeg','bmp'],uploadPath="./upload/images"){
        const splits = file.name.split('.');
        const fileName = splits[0]+new Date().getTime() 
        const extName = splits.length > 1 ? splits[splits.length - 1] : '';
        if(allowExt.includes(extName)){
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) throw err;
        });

        let fullFileName = uploadPath+'/'+fileName+'.'+extName
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        // 创建可写流
        const upStream = fs.createWriteStream(fullFileName);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        fullFileName = \`http://localhost:8081/\$\{fileName\}.\$\{extName\}\`
        return fullFileName;
        }else{
        return undefined
        } 
    },
    // 获取最近一周的日期
    getWeekDate(){
    let date = new Date()
    // 最近一周的日期
    let week = []
    let j = 0
    for(let i = 0 ; i < 7; i++){
        let time = date.getTime() - (86400 * i * 1000)
        let da = this.getDate(new Date(time))
        week.unshift(da)
    }
    return week

    },
    // new Date 格式化年月日
    getDate(date){
        let year = (date.getFullYear()).toString()
        let month = (date.getMonth()+1).toString()
        let day = (date.getDate()).toString()
        if(month.length < 2){
            month = '0'+month
        }
        if(day.length < 2){
            day = '0'+day
        }
        return \`\$\{year\}-\$\{month\}-\$\{day\}\`
    }
}
`


return {
    makePageData,
    retJson,
    util
}
}