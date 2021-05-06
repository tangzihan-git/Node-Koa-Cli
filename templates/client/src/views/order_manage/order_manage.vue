<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/"></el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection('order')">批量删除</el-button>
                 <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
                <el-input v-model="query.key" placeholder="商品名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch('name')">搜索</el-button>
            </div>
            <el-table :data="Datas" v-loading="showLoading" border class="table" ref="multipleTable"  
            header-cell-class-name="table-header" @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="orderNumber" label="订单号"></el-table-column>
                <el-table-column prop="user_name" label="用户"></el-table-column>
                <el-table-column prop="position" label="配送地址"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                    <el-table-column label="封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.cover" :preview-src-list="[scope.row.cover]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sumPrice" label="价格总计"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status==1?'success':scope.row.status==2?'warning':scope.row.status==3?'primary':scope.row.status==4?'danger':'info'"
                        >{{scope.row.status==1?'已完成':scope.row.status==2?'待发货':scope.row.status==3?'待评价':scope.row.status==4?'退款中':'退款成功'}}</el-tag>
                    
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            v-if="scope.row.status==2 || scope.row.status==4"
                        >{{scope.row.status==2?'发货':scope.row.status==4?'确认退款':''}}</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row,'order')"
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
                    @current-change="handlePageChange($event,'order')"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑&添加弹框 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="form.excerpt"></el-input>
                </el-form-item>
                  <el-form-item label="图像" :label-width="formLabelWidth">
                    <el-upload
                    method="post"
                    class="avatar-uploader"
                    :action="this.$C.upload_url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="title=='添加'" :src="imageUrl" class="avatar" alt="">
                    <img v-else :src="form.cover" class="avatar">
                    </el-upload>
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
    name: 'order_manage',
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
            // 如果是商户只请求商户下的订单
            this.getBusinessOrder()
        }else if(this.userinfo.type == 3){
            // 如果是系统管理员请求所有订单
            this.getData('order')
        }
       
    },
    methods: {
         getBusinessOrder(){
            this.getJSON(`/business/order/${this.userinfo.business_id}?pg=${this.query.pageIndex}`).then(res=>{
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
            let text = ''
            let status = 1
            if(row.status == 2) {
                text = '确认发货前请确认商品是否已经处于配送状态！'    
            }
            if(row.status == 4) {
                text = '确定要处理该用户的退款吗？'   
                status = 5 
            }
            this.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.status = status
                //后端修改状态
                this.putJSON(`/order/${row._id}`,{status}).then(res=>{ console.log("订单更新成功"); console.log(res) })
                this.$message({
                    type: 'success',
                    message: '操作成功'
                });
            }).catch(() => {

            });
            

       
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
                this.postJSON('/order',this.form).then(res=>{
                     this.$message.success('添加成功')
                     this.dialogFormVisible=false
                     this.Datas.push(this.form)
                     this.form={}
                }) 
            }else{
                this.putJSON('order/'+this.form._id,this.form).then(res=>{
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
