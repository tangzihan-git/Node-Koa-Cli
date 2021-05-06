<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/"></el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection('comment')">批量删除</el-button>
                <el-input v-model="query.key" placeholder="评论关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch('content')">搜索</el-button>
            </div>
            <el-table :data="Datas" v-loading="showLoading" border class="table" ref="multipleTable"  
            header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户名"></el-table-column>
                <el-table-column label="封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.user_cover"
                            :preview-src-list="[scope.row.user_cover]"
                        ></el-image>
                    </template>
                </el-table-column>
                 <el-table-column prop="start" label="星级"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status>=1?'success':(scope.row.status==0?'danger':'')"
                        >{{scope.row.status>='1'?'正常':'禁用'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row,'comment')"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange($event,'comment')"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑&添加弹框 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="用户" :label-width="formLabelWidth">
                    <el-input v-model="form.user_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input  type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                 <el-form-item label="星级" :label-width="formLabelWidth">
                    <el-input v-model="form.start"></el-input>
                </el-form-item>
                
                <el-form-item label="是否禁用" prop="delivery" :label-width="formLabelWidth" v-show="title!='添加'">
                    <el-switch v-model="form.status" :active-value="0" :inactive-value="1"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'comment_manage',
    data() {
        return {
            editVisible: false, // 编辑框是否展示
            idx: -1,
            id: -1,
            title:'添加',
            form: {
                name: '',
                cover: '',
                excerpt: '',
                status: 1, // 状态
            },
            showBusiness:false,
            business:null,
            Datas: [], // 表格数据
            DatasCopy:[], // 表格数据复制用于搜索
            delList:[], // 要删除的数据
          
        };
    },
    created() {
        if(this.userinfo.type == 2) {
            // 如果是商户只请求商户下的评价
            this.getBusinessComment()
        }else if(this.userinfo.type == 3){
            // 如果是系统管理员请求所有评价
            this.getData('comment')
        }
    },
    methods: {
         getBusinessComment(){
            this.getJSON(`/comment/business/${this.userinfo.business_id}?pg=${this.query.pageIndex}`).then(res=>{
                this.Datas = res.retobj.data
                this.DatasCopy = res.retobj.data
                this.pageTotal = res.retobj.allCount  // 一共多少数据
                this.query.pageSize = res.retobj.length // 一页多少数据
                this.query.nextPage = res.retobj.isNext // 下一页页码
                this.showLoading = false
            })
        },
        // 编辑重写
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            console.log("用户需要编辑")
            console.log(row)
            console.log("用户查看编辑信息")
            this.title = '编辑';
            this.dialogFormVisible = true;
            this.form.cpassword = this.form.password
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.Datas, this.idx, this.form);
        },
        // 添加 / 编辑提交
        submit(){
            if(this.title=='添加'){
                this.postJSON('/comment',this.form).then(res=>{
                     this.$message.success('添加成功')
                     this.dialogFormVisible=false
                     this.Datas.push(this.form)
                     this.form={}
                }) 
            }else{
                this.putJSON('comment/'+this.form._id,this.form).then(res=>{
                    this.$message.success('更新成功')
                     this.dialogFormVisible=false
                     this.form={}
                    
                })

            }
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
