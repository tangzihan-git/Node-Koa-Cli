export default {
    data(){
        return {
            dialogFormVisible:false, 
            formLabelWidth: '120px',
            showLoading:true,
            imageUrl:'',
            query: {
                address:'',
                key: '', // 要检索的关键字
                pageIndex: 1, //当前页
                pageSize: 1, // 一页显示多少条数据
                nextPage:2 // 下一页
            },
            pageTotal: 1, // 总共有多少数据,
            multipleSelection: [],
            userinfo:JSON.parse(localStorage.getItem('userinfo'))
        }
        
    },
    methods:{
        /**
         * 页码初始化获取数据
         * @param {*} entry 要获取的实体
         */
        getData(entry){
            this.getJSON(`/${entry}?pg=${this.query.pageIndex}`).then(res=>{
                this.Datas = res.retobj.data
                this.DatasCopy = res.retobj.data
                this.pageTotal = res.retobj.allCount  // 一共多少数据
                this.query.pageSize = res.retobj.length // 一页多少数据
                this.query.nextPage = res.retobj.isNext // 下一页页码
                this.showLoading = false
            })
        },
        /**
         * 触发搜索
         * @param {*} key 要搜索的字段
         */
        handleSearch(key) {
            this.Datas = this.DatasCopy
            this.$set(this.query, 'pageIndex', 1);
            let data = this.Datas.filter(item=>{
                if(item[key].includes(this.query.key)){
                    return item
                }
        })
            this.Datas = data
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            console.log("用户需要编辑")
            console.log(row)
            this.title = '编辑';
            this.dialogFormVisible = true;
        },
        // 添加操作
        handleAdd(){
            this.form = {}
            this.title = '添加',
            this.dialogFormVisible = true;
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /**
         * 多选删除
         * @param {*} entry  要删除的实体
         */
        delAllSelection(entry) {
            const length = this.multipleSelection.length;
            let ids = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                ids += this.multipleSelection[i]._id + ',';
            }
            // 去掉最后一个逗号
            let dex = ids.lastIndexOf(',')
            let start = ids.substring(0,dex)
            let end = ids.substring(dex+1)
            ids = start+end
            
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$message.success('删除成功');
                let idArr = ids.split(',')
                console.log(idArr)
                // 前端删除
                this.Datas = this.Datas.filter(items=>{
                    if(!idArr.includes(items._id.toString())){
                        return items
                    }
                })
                // 后端删除
                this.multipleSelection = [];
                this.delData(ids,entry)
                })
            .catch(() => {});
        },
        /**
         * 单行删除
         * @param {*} index 当前行索引
         * @param {*} row  当前行数据
         * @param {*} entry 要删除的实体
         */
        handleDelete(index, row,entry) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
        }).then(() => {
            this.$message.success('删除成功');
            this.Datas.splice(index, 1); // 前端删除
            this.delData(row._id,entry) // 后端删除
        })
        },
        /**
         * 请求后台删除数据 
         * @param {*} ids 要删除的id 格式 1，2，3，4，5
         * @param {*} entry 要删除的实体
         */
        delData(ids,entry){
            this.deleteJSON(`/${entry}/${ids}`).then(res=>{
                console.log("后台删除成功")
            })
        },
        // 获取日期
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
            return `${year}-${month}-${day}`
        },
        // 图片上传
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
    
            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        /**
         * 处理图片上传
         * @param {*} res 
         * @param {*} file 
         * @param {*} field 图片上传的字段
         */
        handleAvatarSuccess(res, file, ) {
            console.log("图片上传成功")
            this.imageUrl = URL.createObjectURL(file.raw);
            this.form.avatar ? this.form.avatar = res.retobj : this.form.cover = res.retobj  
        },
         // 分页导航
         handlePageChange(val, entry) {
            this.$set(this.query, 'pageIndex', val);
            this.getData(entry)
        },
    },
    created(){
        this.userinfo = JSON.parse(localStorage.getItem('userinfo'))
    },
}