module.exports = function() {
    return `
    uploader(file,allowExt=['jpg','png','gif','jpeg','bmp'],uploadPath="./upload/images"){
      fs.mkdirSync(uploadPath,{recursive:true});
        const splits = file.name.split('.');
        const fileName = splits[0]+new Date().getTime() 
        const extName = splits.length > 1 ? splits[splits.length - 1] : '';
        if(allowExt.includes(extName)){
        ]
  
          let fullFileName = uploadPath+'/'+fileName+'.'+extName
          // 创建可读流
          const reader = fs.createReadStream(file.path);
          // 创建可写流
          const upStream = fs.createWriteStream(fullFileName);
          // 可读流通过管道写入可写流
          reader.pipe(upStream);
          fullFileName = \`http://localhost:\$\{webPort\}/\$\{fileName\}.\$\{extName\}\`
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
    return \`\$\{year\}-$\{month\}-\$\{day\}\`
   }
 
  
}`
}