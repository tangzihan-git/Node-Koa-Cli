<template>
    <div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="商户名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="销量">
                        <el-input v-model="form.scales"></el-input>
                    </el-form-item>
                    <el-form-item label="商户描述">
                        <el-input type="textarea"  v-model="form.excerpt"></el-input>
                    </el-form-item>
                     <el-form-item label="配送时间">
                        <el-input v-model="form.sendTime"></el-input>
                    </el-form-item>
                    <el-form-item label="起送标准">
                        <el-input v-model="form.sendStart"></el-input>
                    </el-form-item>
                    <el-form-item label="配送价格">
                        <el-input v-model="form.sendMoney"></el-input>
                    </el-form-item>
                     <el-form-item label="图像" >
                        <el-upload
                        method="post"
                        class="avatar-uploader"
                        :action="this.$C.upload_url"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img  :src="form.cover" class="avatar">
                        </el-upload>
                    </el-form-item>
                      <el-form-item label="商户所属分类" :label-width="formLabelWidth" >
                      <el-select v-model="form.category_id" disabled  placeholder="商户所属分类">
                            <el-option
                            v-for="item in categories"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="星级">
                        <el-rate v-model="form.start" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
                    </el-form-item>
                     <el-form-item label="准时到达" >
                        <el-switch v-model="form.isInTime" disabled :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="平台配送">
                       <el-switch v-model="form.isPlatform" disabled :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="推荐商家">
                       <el-switch v-model="form.isReco" disabled :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                      <el-form-item >
                        <el-button type="primary" @click="submit">确 定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'business_info_manage',
    data() {
        return {
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                desc: '',
                options: [],

            },
            categories:[]
        };
    },
    created(){
        this.getData()
        this.getCategory()
    },
    methods: {
        submit() {
              this.putJSON('business/'+this.form._id,this.form).then(res=>{
                    this.$message.success('更新成功')
                    this.dialogFormVisible=false 
                })
        },
        getData(){
            this.getJSON(`/business/${this.userinfo.business_id}?pg=${this.query.pageIndex}`).then(res=>{
                this.form = res.retobj[0]
                this.showLoading = false
            })
        },
        // 获取所有分类
        getCategory(){
             this.getJSON(`/category`).then(res=>{
                this.categories = res.retobj.data
            })
        },
    }
};
</script>