<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection('user')">批量删除</el-button>
                 <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>
                <el-input v-model="query.key" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch('nick')">搜索</el-button>
            </div>
            <el-table :data="Datas" v-loading="showLoading" border class="table" ref="multipleTable"  
            header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="nick" label="用户名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="用户组" align="center">
                    <template slot-scope="scope" >
                        <el-tag :type="scope.row.type == 1 ? 'success' : scope.row.type == 2 ? 'danger' :'primary'">
                            {{scope.row.type == '1' ? '普通用户组' : scope.row.type == '2' ? '商户组' : '管理员组'}}
                        </el-tag>
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
                            @click="handleDelete(scope.$index, scope.row,'user')"
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
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑&添加弹框 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <el-input v-model="form.nick" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" >
                    <el-input v-model="form.cpassword" type="password"></el-input>
                </el-form-item>
                  <el-form-item label="图像" :label-width="formLabelWidth">
                    <el-upload
                    method="post"
                    class="avatar-uploader"
                    :action="this.$C.upload_url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <img v-else :src="form.avatar" class="avatar">
                    </el-upload>
                </el-form-item>
                 <el-form-item label="用户组" :label-width="formLabelWidth" >
                      <el-select v-model="form.type" @change="selectUserGroup" placeholder="选择用户组">
                        <el-option
                        v-for="item in userGrop"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="关联商户" :label-width="formLabelWidth" v-show="form.type == 2">
                      <el-select v-model="form.business_id" @change="selectUserGroup" placeholder="选择关联商户">
                        <el-option
                        v-for="item in business"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id">
                        </el-option>
                    </el-select>
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
    name: 'user_manage',
    data() {
        return {
             userGrop: [{
                label: '普通用户组',
                value: 1
                }, {
                label: '商户组',
                value: 2
                }, {
                label: '管理员组',
                value: 3
            }],
            editVisible: false, // 编辑框是否展示
            idx: -1,
            id: -1,
            title:'添加',
            form: {
                nick:'',
                email:'',
                password:'',
                avatar:'',
                cpassword:'',
                status:1,
                type:1,
                business_id:'',
            },
            showBusiness:false,
            business:null,
            Datas: [], // 表格数据
            DatasCopy:[], // 表格数据复制用于搜索
            delList:[], // 要删除的数据
            imageUrl:''
          
        };
    },
    created() {
       this.getData('user')
       this.getBusiness()
    },
    methods: {
        getBusiness(){
            this.getJSON('/business').then(res=>{
                console.log("获取商户")
                this.business = res.retobj.data
            })
        },
        selectUserGroup(row){
            console.log("查看选择的用户组")
            if(row == 2){
                this.showBusiness = true
            }
        },
        // 编辑重写
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.title = '编辑';
            this.dialogFormVisible = true;
         
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.Datas, this.idx, this.form);
        },
        // 添加 / 编辑提交
        submit(){
            if(this.form.password!=this.form.cpassword){
                return this.$message.warning('密码不一致')
            }
            if(this.title=='添加'){
                delete this.form.cpassword
                this.postJSON('/user',this.form).then(res=>{
                     this.$message.success('添加成功')
                     this.dialogFormVisible=false
                     this.Datas.push(this.form)
                     this.form={}
                }) 
            }else{
               delete this.form.cpassword
                this.putJSON('user/'+this.form._id,this.form).then(res=>{
                    this.$message.success('更新成功')
                     this.dialogFormVisible=false
                     this.form={}
                    
                })

            }
        },
         // 图片上传
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
    
            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
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
            this.form.avatar = res.retobj
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
