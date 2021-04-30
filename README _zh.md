# Node Koa Cli
快速构建koa项目，生成restful API，快速构建后台管理模板。

# 介绍
它不仅是KOA的项目构建工具，而且可以快速生成restful API和最基本的后台管理模板。您只需要输入一行命令，并写入一些配置文件。Node koa cli将帮助您完成所有重复的事情。

# 安装
```
npm install node-koa-cli -g
```
or
```
npm install node-koa-cli -d
```
# 命令和参数
**使用命令**

如果在本地安装node koa cli，需要在命令前添加'npx'
**Create Koa Project**
```
koa-cli create [project]
```

这个命令将帮助您构建最基本的koa框架

**Generate restful API**
```
koa-cli make:curd
```
这个命令将基于`/ config / model`下的配置文件生成resetFul风格的API。

# 如何编写配置文件
利用cli自动生成restful 风格的api,你需要在 /config/model下编写模型的配置文件
如果你之前运行命令 `koa-cli create [porject]` 选择的数据库类型是`MongoDB`，那么cli会自动帮你创建数据表
如果你选择的是`MySQL`,那么你需要利用 `sequlize-cli`,帮你创建数据表，不过不用担心,不管你选择什么数据库类型，cli都会帮你生成restful风格的api

下面给出模型配置文件的示例
如果你需要创建一个数据表名为example，同时又想cli帮你生成最基础的curd,那么你应该在/config/model下
新建一个example_model.js的文件，并参照下例编写配置
```
// config/model/example_model.js
module.exports = {
    modelName:'Example',
    fields: {
        name: {
            type: "String",
            isUnique: true,
        },
        sex: {
            type: "String",
        },
        phone: {
            type: "String",
            isUnique: true
        }
    },
    actions: {
        create: {
            fields: ['name','sex','phone']
        },
        remove: {
            by: ['_id']
        },
        update: {
            by: ['_id'],
            fields: ['name','sex','phone']
        },
        find: {
            by:['_id','name','phone','name,password']
        }
    },
    other: {
        uniqueDesc:'账户已经存在'
    }
}
```


现阶段node-koa-cli的模型配置非常简单，只有四个属性 `modelName`、`fields`、`actions`、`other`.
**fields**
fields表示数据表的字段，它接受一个对象，用于描述该字段，目前可配置的属性有 `type`,和 `isUnique`
fields.type 接受一个字符串，表示该字段的类型，可选值有`String`、`Number`、`Boolean`...,更多数据类型请参照mongoose或者sequelize,node-koa-cli完全兼容它们！
fields.isUnique 的值只能为`true/false` 表示该字段是否是唯一的，当字段的`isUnique`被设置为`true`时，每次执行create都会进行字段唯一性验证，同时控制器会生成验证逻辑

> 注意：在MongoDB模式下不要在模型配置文件的fields 属性添加 `_id`,这会导致程序出现意料不到的问题！！！


示例：
```
// config/model/example_model.js
fields: {
    name: {
        type: "String",
        isUnique: true,
    },
    sex: {
        type: "String",
    },
    phone: {
        type: "String",
        isUnique: true
    }
},
```
上面的配置会在 /controllers/example.js 里面生成如下代码
```

async store(ctx) {
    if( await  db.Example.getExampleByName(ctx.request.body.name) ||  await  db.Example.getExampleByPhone(ctx.request.body.phone) ){
        ctx.body = new RetJson(403, '账户已经存在')
        return;
    }
   ...
},
```
当然后期提供更多的数据格式验证。

**actions**
actions表示该模型的操作，包含 `create`,`update`,`remove`,`find`.
actions.create 会生成restFul 风格的添加操作，actions.create.fields表示允许被插入的数据表的字段
示例：
```
create: {
    fields: ['name','sex']
},
```
上面的配置会在 /controllers/example.js生成如下代码
```
async store(ctx) {
const eg = await db.Example.createExample({
        name: ctx.request.body.name,
        sex: ctx.request.body.sex,
    })
    ctx.body = new RetJson('success',eg)
},
```
**update**
update与create相差不大，这里不在详叙。
它们的主要区别就是 update多了一个by属性，这个属性表示以哪个字段作为条件去更新数据
示例：
```
actions: {
    update: {
        by: ['_id'],
        fields: ['name','sex','phone']
    },
},
```
上面的配置会在 /models/example.js生成如下代码
```
static async updateExampleById(_id,obj) {
    return new Promise(async (res,rej) => {
        const eg = await this.updateMany({ _id }, obj);
        if(eg){
            res(eg)
        }else{
            rej('更新失败')
        }
    })
}
```
/controller/example.js 生成如下代码
```
async update(ctx) {
    const eg = await db.Eg.updateExampleById(ctx.params._id,{
        name: ctx.request.body.name,
        sex: ctx.request.body.sex,
        phone: ctx.request.body.phone,
    })
    ctx.body = new RetJson('success',eg)
},
```
**remove**
remove与upadte配置一样，唯一的区别是remove会生成删除操作，remove不支持配置fields
**find**
find会生成查找操作。
示例
```
find: {
    by:['id','name,password']
}
```
上述配置会在 /models/example.js 生成
```
static async getExample(pg=1){
    return new Promise(async (res,rej)=> {
        const eg = await makePageData(Example, pg=1)
        if(eg.allCount > 0){
            res(eg)
        }else{
            res(undefined)
        }
    })
}

static async getExampleById(id, pg=1) {
    return new Promise(async (res,rej)=> {
        const eg = await makePageData(pg, Example,{ id })
        if(eg.allCount > 0){
            res(eg)
        }else{
            res(undefined)
        }
    })
}

static async getExampleByNameAndPassword(name,password, pg=1) {
    return new Promise(async (res,rej)=> {
        const eg = await makePageData(pg, Example,{ name,password })
        if(eg.allCount > 0){
            res(eg)
        }else{
            res(undefined)
        }
    })
}
```
在 /controllers/example.js生成
```
async  index(ctx){
    const eg = await db.Eg.getEg(ctx.query.pg)
    ctx.body = new RetJson('success',eg)
},
async  show(ctx){
    const eg = await db.Eg.getEgById(ctx.params.id)
    ctx.body = new RetJson('success',eg)
},
```

> 注意，如果给某字段设置了isUnique:true ,那么你需要将该字段添加到 find.by数组中。
