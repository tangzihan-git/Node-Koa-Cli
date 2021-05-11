const fs = require('fs')
module.exports = {
    // 返回唯一字段数组
    getUniqueFiled(fields){
        let arr = []
        for (const key in fields) {
            for (const item in fields[key]) {
              // 字段唯一
              if(item == 'isUnique' && fields[key][item] == true){
                  arr.push(key)
              }
            }
        }
        return arr
    },
    // 首字母大写
    firstWordToUppercase(str){ 
        str = str.toLowerCase();
        var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
        return str.replace(reg,function(m){ 
         return m.toUpperCase()
        });
    },
    // 递归复制文件与文件夹
    checkDirectory(src,dst,callback){
        fs.access(dst, fs.constants.F_OK, (err) => {
          if(err){
            fs.mkdirSync(dst,{ recursive: true });
            callback(src,dst);
          }else{
            callback(src,dst);
          }
         });

    }
    
}