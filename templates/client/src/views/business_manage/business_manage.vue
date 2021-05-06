<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/"></el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection('business')">批量删除</el-button>
                 <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
                <el-input v-model="query.key" placeholder="商户" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch('name')">搜索</el-button>
            </div>
            <el-table :data="Datas" v-loading="showLoading" border class="table" ref="multipleTable"  
            header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column label="封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.cover"
                            :preview-src-list="[scope.row.cover]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sendTime" label="配送时间" align="center">
                     <template slot-scope="scope">
                        {{scope.row.sendMoney}}<sub>min</sub>
                    </template>
                </el-table-column>
                <el-table-column prop="startSend" label="起送价格" align="center">
                     <template slot-scope="scope">
                      ￥ {{scope.row.startSend}}
                    </template>
                </el-table-column>
                <el-table-column prop="sendMoney" label="配送价格" align="center">
                     <template slot-scope="scope">
                      ￥ {{scope.row.sendMoney}}
                    </template>
                </el-table-column>
                <el-table-column prop="isInTime" label="及时达" align="center">
                     <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.isInTime>=1?'primary':(scope.row.isInTime==0?'danger':'')"
                        >{{scope.row.isInTime>='1'?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="isPlatform" label="平台配送" align="center">
                     <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.isPlatform>=1?'primary':(scope.row.isPlatform==0?'danger':'')"
                        >{{scope.row.isPlatform>='1'?'是':'否'}}</el-tag>
                    </template>
                </el-table-column>
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
                            @click="handleDelete(scope.$index, scope.row,'business')"
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
                    @current-change="handlePageChange($event,'business')"
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
                <el-form-item label="销量" :label-width="formLabelWidth">
                    <el-input v-model="form.scales"></el-input>
                </el-form-item>
                <el-form-item label="配送时间" :label-width="formLabelWidth">
                    <el-input v-model="form.sendTime"></el-input>
                </el-form-item>
                 <el-form-item label="起送价格" :label-width="formLabelWidth">
                    <el-input v-model="form.startSend"></el-input>
                </el-form-item>
                 <el-form-item label="配送价格" :label-width="formLabelWidth">
                    <el-input v-model="form.sendMoney"></el-input>
                </el-form-item>
                <el-form-item label="所属分类" :label-width="formLabelWidth">
                      <el-select v-model="form.category_id"  placeholder="选择所属分类">
                        <el-option
                        v-for="item in categories"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="星级" :label-width="formLabelWidth">
                    <el-input v-model="form.start" ></el-input>
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
                <el-form-item label="是否禁用" prop="delivery" :label-width="formLabelWidth" >
                    <el-switch v-model="form.status" :active-value="0" :inactive-value="1"></el-switch>
                </el-form-item>
                  <el-form-item label="是否及时达" prop="delivery" :label-width="formLabelWidth" >
                    <el-switch v-model="form.isInTime" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                  <el-form-item label="是否平台配送" prop="delivery" :label-width="formLabelWidth" >
                    <el-switch v-model="form.isPlatform" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                 <el-form-item label="是否推荐首页" prop="delivery" :label-width="formLabelWidth" >
                    <el-switch v-model="form.isReco" :active-value="1" :inactive-value="0"></el-switch>
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
    name: 'business_manage',
    data() {
        return {
            editVisible: false, // 编辑框是否展示
            idx: -1,
            id: -1,
            title:'添加',
            form: {
                name: '1231', // 商户名称
                category_id: '', // 商户分类
                cover: '', // 商户封面
                scales:1,// 销量
                excerpt: '', // 商户描述
                sendTime:'', // 配送时间
                startSend: '', // 起送标准
                sendMoney: '', // 配送价格
                start: 3, // 星级
                isInTime: 1, // 是否准时达
                isPlatform:1, // 是否平台配送
                status:  1, // 状态
                isReco:0,  //是否推荐
            },
            showBusiness:false,
            business:null,
            Datas: [], // 表格数据
            DatasCopy:[], // 表格数据复制用于搜索
            delList:[], // 要删除的数据
            categories:[]
          
        };
    },
    created() {
       this.getData('business')
       this.getCategory()
    },
    methods: {
        getCategory(){
             this.getJSON(`/category`).then(res=>{
                this.categories = res.retobj.data
            })
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
                // return console.log(this.form)
                this.postJSON('/business',this.form).then(res=>{
                     this.$message.success('添加成功')
                     this.dialogFormVisible=false
                     this.Datas.push(this.form)
                     this.form={}
                }) 
            }else{
                this.putJSON('business/'+this.form._id,this.form).then(res=>{
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
