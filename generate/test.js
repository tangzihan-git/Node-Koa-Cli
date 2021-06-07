const glob = require('glob');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { noAllowdField } = require('../config/config_static');
const { firstWordToUppercase } = require('../lib/common');
const { checkDirectory, awaitMe } = require('../lib/common')
const clientRoot = path.join( __dirname, '../templates/client')
const root = `${process.cwd()}/client`
const {  ConfigModelRoot }  = require(`${path.resolve(process.cwd(),'./node_koa.config')}`); // 模型配置文件存放路径
const models = glob.sync(`${ConfigModelRoot}/**/*_model.js`); // 获取所有模型配置文件
const viewTemplate = require('../templates/client_view/view_template'); // 视图模板文件
const routerTemplate = require('../templates/client_view/router_template'); // 路由模板文件
const slideBarTemplate = require('../templates/client_view/slidebar_template'); // 路由模板文件
module.exports  = async function (){
    // 将模板复制到项目根目录
    checkDirectory(clientRoot,root ,copy);
    await awaitMe(1000)
    if(models.length == 0) throw Error(`\n 没有在${ ConfigModelRoot }中找到任何模型配置文件！\n No model configuration files were found in ${ ConfigModelRoot }\n`)
    // 所有模型的路由
    let children =  `[
                {
                    path: '/home',
                    component: () => import('../views/index/index.vue'),
                    meta: { title: '系统首页',  }
                },
                {
                    path: '/404',
                    component: () => import('../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import('../components/page/403.vue'),
                    meta: { title: '403' }
                },`
    let slideMenu  = `[`
       
    models.forEach(async (f) => {
        const ctrlClass = require(f);
        // 检查是否有不能填写的字段
        Object.keys(ctrlClass.fields).forEach(item =>{
            if(noAllowdField.includes(item)){
                throw Error(`字段不允许出现：[${ noAllowdField }]\nField not allowed[${ noAllowdField }]`)
            }
        })
        const modelName = ctrlClass.modelName.toLowerCase(); // 模型名称
        const upperModelName = firstWordToUppercase(modelName); // 模型首字母大写
        // return console.log(ctrlClass.fields)
        let modelFields = [];
        let searchFiled = ''; // 要被搜索的字段
        let searchFiledComment = '' // 要被搜索字段的描述
        for (const key in ctrlClass.fields) {
          // 去除_id字段，这些字段不方便在表格展示 
          if( !(key.includes('_id') || key.includes('Id') ) ) {
            let temp = {};
            temp[key] = ctrlClass.fields[key]
            modelFields.push(temp)
          }
          if(ctrlClass.fields[key].hasOwnProperty('isSearch')){
            searchFiled = key
            searchFiledComment = ctrlClass.fields[key].comment
    
          }
         
        }
        const handleCode = makeHandleCode(ctrlClass, modelName, searchFiled, searchFiledComment)
        const { tableCode, editCode } = makeTableCode(ctrlClass, modelName, modelFields)
        const paginationCode = makePaginationCode(modelName)
        const vueCode = makeVue(modelName ,ctrlClass, modelFields)
        // 生成视图
        fs.mkdir(`${ root }/src/views/${ modelName }_manage`, { recursive: true }, (err) => {
          if (err) throw err;
          fs.writeFile(`${ root }/src/views/${ modelName }_manage/${ modelName }_manage.vue`,viewTemplate( handleCode, tableCode, paginationCode, editCode, vueCode ) , (err) => {
            if (err) throw err;
          });
          console.log(`${ root }/src/views/${ modelName }_manage/${ modelName }_manage/${ modelName }_manage.vue 生成成功！`)
        });
        // 生成路由
       
        children +=  `
                {
                path: '/${ modelName }_manage',
                    component: () => import('../views/${ modelName }_manage/${ modelName }_manage.vue'),
                    meta: { title: '${ ctrlClass.modelCn ? ctrlClass.modelCn : modelName }', isAdmin:true, isSuper: ${ ctrlClass.isSuper ? true : false} }
                },\n`
         // 生成左侧菜单
        slideMenu += `
                {
                    icon: '${ ctrlClass.icon ? ctrlClass.icon : 'el-icon-eleme' }',
                    index: '${ modelName }_manage',
                    title: '${ ctrlClass.modelCn ? ctrlClass.modelCn : modelName }',
                    type:[2, ${ ctrlClass.isSuper ? 3 :'' }] 
                },`
    })
    children += `
            ] `
    slideMenu += `
            ] `
    // 生成前端路由文件
    fs.writeFile(`${ root }/src/router/index.js`, routerTemplate(children), (err) => {
      if (err) throw err;
      console.log(`${ root }/src/router/index.js 生成成功`)
    });
    // 生成左侧导航
    fs.writeFile(`${ root }/src/components/common/Sidebar.vue`, slideBarTemplate(slideMenu), (err) => {
        if (err) throw err;
        console.log(`${ root }/src/components/common/Sidebar.vue`)
    });
   

   
}


/**
 * 生成表格上方的操作代码 
 * @param {*} model 模型配置文件
 * @param {*} modelName 模型名称
 * @param {*} searchFiled 要被搜索的字段
 * @param {*} searchFiledComment 搜索字段描述
 * @returns 
 */
function makeHandleCode(model, modelName, searchFiled, searchFiledComment){
  let handleCode = ''
  if ( model.actions.hasOwnProperty('remove') ) {
    handleCode += `
            <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection('${modelName}')">批量删除</el-button>`
  }
  if ( model.actions.hasOwnProperty('create') ) {
    handleCode += `
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新增</el-button>`
  }
  if ( searchFiled ) {
    handleCode += `
            <el-input v-model="query.key" placeholder="${searchFiledComment}" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch('${searchFiled}')">搜索</el-button>
`
  }
  return handleCode

}

/**
 * 生成表格代码
 * @param {*} model 模型类
 * @param {*} modelName 模型名称
 * @param {*} modelFields 生成表格需要的字段
 * @returns 
 */
function makeTableCode(model,modelName,modelFields){
  let tableCode = ''
  let editCode = ''
  if(modelFields instanceof Array){
    modelFields.forEach(item=>{
      for (const key in item) {
        // console.log(item[key])
        // isStatus:该字段是否为一个标识 
        // * isCover:该字段是否存放的是图片
        // * isScore:该字段是一个评分组件 
        // * isHidden:该字段不会出现在管理视图里面
        if( !(item[key].hasOwnProperty('isHidden') || item[key].type.toLowerCase() == 'text') ){
          // ishidden 与类型为text的字段不应该展示在表格中
          // 封面组件
          if ( item[key].hasOwnProperty('isCover') ) {
  tableCode += `
                <el-table-column label="封面(查看大图)" align="center">
                  <template slot-scope="scope">
                      <el-image class="table-td-thumb" :src="scope.row.${ key }" :preview-src-list="[scope.row.${ key }]"></el-image>
                  </template>
                </el-table-column>`
  editCode += `
            <el-form-item label="图像" :label-width="formLabelWidth">
                <el-upload
                method="post"
                class="avatar-uploader"
                :action="this.$C.upload_url"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="title=='添加'" :src="imageUrl" class="avatar" alt="">
                <img v-else :src="form.${ key }" class="avatar">
                </el-upload>
            </el-form-item>`

          // 状态组件
          }else if ( item[key].hasOwnProperty('isStatus') ) {
tableCode += `
                <el-table-column label="状态" align="center">
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.${ key }>=1?'success':(scope.row.${ key }==0?'danger':'')"
                      >{{scope.row.${ key }>='1'?'正常':'禁用'}}</el-tag>
                  </template>
                </el-table-column>`
editCode += `
            <el-form-item label="是否禁用" prop="delivery" :label-width="formLabelWidth" >
                <el-switch v-model="form.${ key }" :active-value="0" :inactive-value="1"></el-switch>
            </el-form-item>`
          // 评分组件 
          }else if( item[key].hasOwnProperty('isScore') ) {
tableCode += `
              <el-table-column prop="level" label="${ item[key].comment ? item[key].comment : key }" width="200">
                <template slot-scope="scope">
                <el-rate v-model="scope.row.${ key }" disabled></el-rate>
                </template>
              </el-table-column>`
editCode += `
            <el-form-item label="${ item[key].comment ? item[key].comment : key }" :label-width="formLabelWidth">
                <el-rate v-model="form.${ key }" ></el-rate>
            </el-form-item>`
          // 普通列数据组件  
          }else{
tableCode += `
                <el-table-column prop="${ key }" label="${ item[key].comment ? item[key].comment : key }"></el-table-column>`
editCode += `
            <el-form-item label="${ item[key].comment ? item[key].comment : key }" :label-width="formLabelWidth">
                <el-input v-model="form.${ key }" autocomplete="on"></el-input>
            </el-form-item>`
          }

        }else {
          // text 与 hidden处理，他们在编辑的时候是可以展示的
          if( item[key].type.toLowerCase() == 'text' ){
editCode += `
            <el-form-item label="${  item[key].comment ? item[key].comment : key}" :label-width="formLabelWidth">
                <quill-editor ref="myTextEditor" v-model="form.${ key }" :options="editorOption"></quill-editor>
            </el-form-item>`

          }else{
            // ishidden 的字段暂时用input
editCode += `
            <el-form-item label="${ item[key].comment ? item[key].comment : key }" :label-width="formLabelWidth">
                <el-input v-model="form.${ key }" autocomplete="on"></el-input>
            </el-form-item>`

          }
        }
      }
    })

  }

  let  foreignCode = ""; 
  if (model.hasOwnProperty('foreign')) {
    model.foreign.forEach( item => {
foreignCode += `
                <el-table-column prop="${ item.key }" label="${ item.foreignDesc ? item.foreignDesc : item.onModel }">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.${ item.key }"  placeholder="选择所属${ item.foreignDesc ? item.foreignDesc : item.onModel }">
                      <el-option v-for="item in ${ item.onModel }s" :key="item.${ item.refer }" :label="item.${ item.referLabel }" :value="item.${ item.refer }"></el-option>
                    </el-select>
                  </template>
                </el-table-column>`

editCode += `
            <el-form-item label="${ item.foreignDesc ? item.foreignDesc : item.onModel }" :label-width="formLabelWidth">
                <el-select v-model="form.${item.key}"  placeholder="选择所属${ item.foreignDesc ? item.foreignDesc : item.onModel }">
                    <el-option v-for="item in  ${ item.onModel }s" :key="item.${ item.refer }" :label="item.${ item.referLabel }" :value="item.${ item.refer }"></el-option>
                </el-select>
            </el-form-item>`

    })
  }

  tableCode += foreignCode
  // 数据操作组件 
tableCode += `
                <el-table-column label="操作" width="180" align="center">
                  <template slot-scope="scope">
                    ${ model.actions.hasOwnProperty('update') ? '<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>' :'' }
                    ${ model.actions.hasOwnProperty('remove') ? '<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row, \''+modelName+'\')">删除</el-button>':'' }
                    
                  </template>
                </el-table-column>`

  return {
    tableCode,
    editCode
  }
 

}

/**
 * 生成分页代码
 * @param {*} modelName 
 * @returns 
 */
function makePaginationCode (modelName) {
  return `
        <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange($event,'${ modelName }')"
        ></el-pagination>
        </div>`
}


/**
 * 生成 vue 组件的代码
 * @param {*} modelName 模型名称
 * @param {*} model 模型
 * @param {*} modelFields 字段
 * @returns 
 */
function makeVue (modelName, model, modelFields) {
  let methods =  
  `
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.title = '编辑';
            this.dialogFormVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success('修改第'  + this.idx + 1  + '行成功');
            this.$set(this.Datas, this.idx, this.form);
        },
        // 添加 / 编辑提交
        submit(){
            if(this.title=='添加'){
                this.postJSON('/${ modelName }',this.form).then(res=>{
                    this.$message.success('添加成功')
                    this.dialogFormVisible=false
                    if(this.Datas) {
                      this.Datas.push(this.form)
                    }else {
                      this.Datas = [ this.form ]
                    }
                    
                    this.form={}
                }) 
            }else{
                this.putJSON('${ modelName }/'+this.form.id,this.form).then(res=>{
                    this.$message.success('更新成功')
                    this.dialogFormVisible=false
                    this.form={}
                    
                })
        
            }
        },`
  let initMethods = '' // create 里面要调用的方法
  let dataForeign = '' // data 里面要初始化的外键数据
  let isText = false // 是否有TEXT类型的字段
  modelFields.forEach(item=>{
    for (const key in item) {
      if(item[key].type .toLowerCase() == 'text' ){
        isText = true
      }
    }
  })

  // 外键方法 如 文章的所有分类
  if( model.foreign != undefined && model.foreign  instanceof Array){
      model.foreign.forEach( item => {
        methods += `
        get${ firstWordToUppercase( item.onModel) }(){
            this.getJSON('/${ item.onModel.toLowerCase() }').then(res=>{
                this.${ item.onModel.toLowerCase() }s = res.retobj.data
            })
        },    
    `
    initMethods += `this.get${ firstWordToUppercase( item.onModel) }()
        `
    dataForeign += `${ item.onModel.toLowerCase() }s: [], // ${ item.foreignDesc ? item.foreignDesc : item.onModel }
        `
      })
      
    }


const vueCode = `
${ isText ? `
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {quillEditor, Quill} from 'vue-quill-editor'
// 图片base64 转换为 地址
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
` : '' }

export default {
    name: '${ model.modelName.toLowerCase() }_manage',
    data() {
        return {
            editVisible: false, // 编辑框是否展示
            idx: -1,
            id: -1,
            title:'添加',
            form: {}, // 编辑，添加的表单数据
            // 编辑器配置文件 用于 TEXT 类型
            ${ isText ? `
            editorOption: {
              modules: {
              ImageExtend: {
                  loading: true,
                  name: "file",
                  size: 90000,
                  action: this.$C.upload_url,
                  response: res => {
                      console.log("图片上传成功")
                      return res.retobj
              
                  },
                  headers: (xhr,formData) => {
                  //xhr.setRequestHeader(
                  //  "X-Nideshop-Token",
                  //  localStorage.getItem("token")
                  //);
                  }, // 可选参数 设置请求头部
                  sizeError: () => {
                  return this.$message.error("图片超过50kb");
                  } // 图片超过大小的回调
              },
              toolbar: {
                  container: [
                  ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
                  ["blockquote", "code-block"], //引用，代码块
                  [{ header: 1 }, { header: 2 }], // 几级标题
                  [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
                  [{ script: "sub" }, { script: "super" }], // 下角标，上角标
                  [{ indent: "-1" }, { indent: "+1" }], // 缩进
                  [{ direction: "rtl" }], // 文字输入方向
                  [{ size: ["small", false, "large", "huge"] }], // 字体大小
                  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                  [{ color: [] }, { background: [] }], // 颜色选择
                  [{ font: [] }], // 字体
                  [{ align: [] }], // 居中
                  ["link", "image"],
                  ["clean"]
                  ],
                  handlers: {
                  image: function() {
                      QuillWatch.emit(this.quill.id);
                  }
                  }
              }
              }
        },` : '' } 
        Datas: [], // 表格数据
        DatasCopy:[], // 表格数据复制用于搜索
        delList:[], // 要删除的数据
        ${ dataForeign }
          
        };
    },
    components: {
        ${  isText ? 'quillEditor' : ''}
    },
    created() {
       this.getData('${ model.modelName.toLowerCase() }')
       ${ initMethods }
    },
    methods: {
        ${ methods }
    }
};
  `
  return vueCode
}


var copy=function(src,dst){
  let paths = fs.readdirSync(src); //同步读取当前目录
  paths.forEach(function(path){
    var _src=src+'/'+path;
    var _dst=dst+'/'+path;
    fs.stat(_src,function(err,stats){ //stats 该对象 包含文件属性
      if(err)throw err;
      if(stats.isFile()){ //如果是个文件则拷贝
        let readable=fs.createReadStream(_src);//创建读取流
        let writable=fs.createWriteStream(_dst);//创建写入流
        readable.pipe(writable);
      }else if(stats.isDirectory()){ //是目录则 递归
        checkDirectory(_src,_dst,copy);
      }
    });
  });
}


