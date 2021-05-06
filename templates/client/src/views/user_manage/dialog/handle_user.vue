<template>
<!-- <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button> -->

  <el-dialog :title="title" :visible="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="用户昵称" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="on"></el-input>
    </el-form-item>
    <el-form-item label="用户邮箱" :label-width="formLabelWidth">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
     <el-form-item label="用户密码" :label-width="formLabelWidth">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close(false)">取 消</el-button>
    <el-button type="primary" @click="close(false)">确 定</el-button>
  </div>
</el-dialog>

</template>

<script>
export default {
    props:{
        title:{
            type: String,
            default:'添加'
        },
        dialogFormVisible:{
            type: Boolean,
        }
    },
    data(){
        return {
            form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
            },
            formLabelWidth: '120px'
        }
       
    },
    mounted(){
      document.addEventListener("click",(e)=>{
        // if(this.dialogFormVisible){
        //   this.close();
        // }
        console.log(e.target.class)
        console.log(this.dialogFormVisible)
        
      })
    },
    methods:{
         close(newVal){
            this.$emit('update:dialogFormVisible', newVal)
        }
    }
}
</script>

<style>

</style>