#!/usr/bin/env node
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const configTemplate = require('./templates/common/config_template'); // 配置文件模板
const appController = require('./templates/common/app_controller_template');
const packageTemplate = require('./templates/package_template');
const modelConfigTemplate = require('./templates/common/model_config_template');
const accountControllerTemplate = require('./templates/common/account_controller_template');
let root = process.cwd();

const program  = require('commander');
const minimist = require('minimist');
const chalk = require('chalk');
const chooseArg = require('./lib/promptModules/choose');
program
 .command('create <app-name>')
 .description('Create a new project powered by node-koa-cli')
 .action(async (name, cmd) => {
   // console.log(`创建${name}目录`)
    console.log(chalk.bold.blue(`Node Koa Cli ${require('./package').version}`))
    if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(chalk.yellow('\n Warning: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    // 选择参数
    const arg = await chooseArg()
    root = path.resolve(root, `./${name}`)
    // 创建项目跟目录
    fs.mkdirSync(root, { recursive: true })
    // 根据用户的选项生成package.json 并执行npm install
    makePackage(name, arg)
    // 生成最基础下项目骨架
    __init__(arg)
   console.log('@ Successfully created project ' + chalk.yellow(`${name}`));
   console.log('@ Get started with the following commands:')

   console.log(chalk.blue(`     $ cd ${name}`))
   console.log(chalk.blue(`     $ npm install`))
   console.log(chalk.blue(`     $ npm run start:dev`))

 })

 program
 .command('make:curd')
 .description('Quickly generate restful API according to model configuration file')
 .option('-m, --m [type]', 'Select a model to generate curd')
 .action(async (name, cmd) => {
    console.log(chalk.yellow('ready...'))
    let model = name.m
    if (model) {
      // 选择一个已经存在的模型生成curd
      require('./generate/create')(process.cwd(),{}, `${model}_model.js`)
    }else {
      // 根据所有模型生成curd
      require('./generate/create')(process.cwd())
    }
    // 生成curd
  
    console.log(chalk.blue('model, controller and router are generated successfully!'))

 })
 program
 .command('make:admin')
 .description('Quickly generate background management system according to model configuration file')
 .action(async (name, cmd) => {
    console.log(chalk.yellow("The module is under development..."))
   // 创建管理系统根目录
    fs.mkdirSync(`${root}/client`,{recursive:true})
   // 填入静态文件
    require('./generate/test')()
   

 })

// cli初始化
async function __init__(options){
   fs.mkdirSync(`${root}/models`,{recursive:true})
   fs.mkdirSync(`${root}/controllers`,{recursive:true})
   fs.mkdirSync(`${root}/router`,{recursive:true})
   fs.mkdirSync(`${root}/lib`,{recursive:true})
   fs.mkdirSync(`${root}/config/model`,{recursive:true})  

   // 写入cli配置文件
   fs.writeFile(`${root}/node_koa.config.js`,configTemplate(options) , (err) => {
        if (err) throw err;
    });
  // 写入数据库配置文件
  fs.writeFile(`${root}/config/config.json`,JSON.stringify(require('./config/config.json'), null, 4), (err) => {
    if (err) throw err;
  });
  // 初始化app_controller
  fs.writeFile(`${root}/controllers/app.js`,appController(), (err) => { if (err) throw err;});
  // 生成jwt授权认证
  if(options.jwt){
    fs.writeFile(`${root}/controllers/account.js`,accountControllerTemplate() , (err) => {
      if (err) throw err;
  });
    
  }
  // 写入一个测试模型
  fs.writeFile(`${root}/config/model/user_model.js`,modelConfigTemplate(options.type) , (err) => {
      if (err) throw err;
      require('./generate/create')(root,options)

  });
  

}
 
async function makePackage(name,arg){
   const content = packageTemplate(name,arg)
   fs.writeFile(`${root}/package.json`, content, (err) => {
       if (err) throw err;
       // package.json生成成功后运行npm install(扩展功能)
   });
}  


program.parse(process.argv);



