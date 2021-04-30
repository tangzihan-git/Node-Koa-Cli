module.exports = {
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
    firstWordToUppercase(str){ 
        str = str.toLowerCase();
        var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
        return str.replace(reg,function(m){ 
         return m.toUpperCase()
        });
    },
    
}