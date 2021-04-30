module.exports = function() {
    const makePageData  = `module.exports = {
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
const retJson =
`class RetJson {
    constructor(errcode = 0, errmsg = '', retobj = '') {
        this.errcode = errcode;
        this.errmsg = errmsg;
        this.retobj = retobj;
    }
}    
module.exports = RetJson;`

return {
    makePageData,
    retJson
}
}