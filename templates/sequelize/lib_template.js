module.exports = function() {
    const makePageData  = `module.exports = {
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