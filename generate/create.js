const glob = require('glob');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { noAllowdField } = require('../config/config_static');
const { firstWordToUppercase } = require('../lib/common');

module.exports =  function(root,options={}) {
    const {  DataBaseLib, ConfigModelRoot, StaticRouter }  = require(`${path.resolve(root,'./node_koa.config')}`); 
    const ModelRoot = path.resolve(root,'./models'); // 模型文件的根路径
    const RouterRoot = path.resolve(root,'./router');// 路由文件根路径
    const ControllerRoot = path.resolve(root,'./controllers'); // 控制器文件的根路径
    const libRoot = path.resolve(root,'./lib');
    const { generateModelMethods } = require(`./${DataBaseLib}/makeModel`); // 生成模型方法
    const { generateControllerMethods, generateRouterMethods } = require('./common')
    const { commonModel,indexModel } = require(`../templates/${DataBaseLib}/model_template`); // 模型模板文件
    const controllerTemplate = require(`../templates/common/controller_template`); // 控制器模板文件
    const routerTemplate = require('../templates/common/router_template'); // 路由模板文件
    const routerStaticTemplate = require('../templates/common/router_static_template'); // 静态路由模板文件
    const appTemplate = require('../templates/app_template'); // 入口文件模板文件
    const libTemplate = require(`../templates/common/lib_template`); //工具库模板文件
    const models = glob.sync(`${ConfigModelRoot}/**/*_model.js`); // 获取所有模型配置文件
    
    const absoluteRoot = os.platform() === 'win32' ? ConfigModelRoot.replace(/\\/ig, '/') : ConfigModelRoot;
    if(models.length == 0) throw Error(`\n 没有在${ ConfigModelRoot }中找到任何模型配置文件！\n No model configuration files were found in ${ ConfigModelRoot}\n`)
    // 生成模型入口文件
    fs.writeFile(`${ModelRoot}/index.js`, indexModel(), (err) => {
        if (err) throw err;
    });
    models.forEach(async (f) => {
        const ctrlClass = require(f);
        // 检查是否有不能填写的字段
        Object.keys(ctrlClass.fields).forEach(item =>{
            if(noAllowdField.includes(item)){
                throw Error(`字段不允许出现：[${noAllowdField}]\nField not allowed[${noAllowdField}]`)
            }
        })
        // 去掉控制器绝对路径部分，去掉控制器_model后缀，生成一个模型名称
        const modelName = f.replace(absoluteRoot, '').replace('/','').replace(/\_|model/g, '');
        const upperModelName = firstWordToUppercase(modelName.replace('.js',''));
        const modelMethods = generateModelMethods(ctrlClass) // 根据配置文件生成的模型方法
        const controllerMethods = generateControllerMethods(ctrlClass) // 根据配置文件生成的控制器方法
        // 将生成好的模型写入文件
        fs.writeFile(`${ModelRoot}/${modelName}`, commonModel(ctrlClass,modelMethods), (err) => {
            if (err) throw err;
            // console.log(`模型：${modelName}生成成功`);
        });
        // 将生成好的控制器写入文件
        generateController(ControllerRoot ,modelName, controllerTemplate(upperModelName, controllerMethods))
    })
    // 生成路由文件控制器引用,并写入路由文件
    generateRouter(RouterRoot,routerTemplate(generateRouterMethods(models)))
    // 用户是否配置了静态文件路由
    if(StaticRouter){
        generateStaticRouter(RouterRoot,routerStaticTemplate())
    }
    // 生成入口文件
    generateApp(root,appTemplate(options))
    // 生成库文件
    generateLib(libRoot,libTemplate,DataBaseLib)

}


async function generateController(root,controllerName,content) {
    fs.writeFile(`${root}/${controllerName}`, content, (err) => {
        if (err) throw err;
    });
}
async function generateRouter(root,content) {
    fs.writeFile(`${root}/index.js`, content, (err) => {
        if (err) throw err;
    });
}

async function generateStaticRouter(root,content) {
    fs.writeFile(`${root}/static.js`, content, (err) => {
        if (err) throw err;
    });
}

async function generateApp(root,content) {
    fs.writeFile(`${root}/app.js`, content, (err) => {
        if (err) throw err;
    });
}

async function generateLib(libRoot, libTemplate,type){
    fs.writeFile(`${libRoot}/util.js`,libTemplate(type).util , (err) => {
        if (err) throw err;
    });
    fs.writeFile(`${libRoot}/common.js`,libTemplate(type).makePageData , (err) => {
        if (err) throw err;
    });
    fs.writeFile(`${libRoot}/retjson.js`,libTemplate(type).retJson , (err) => {
        if (err) throw err;
    });
}

