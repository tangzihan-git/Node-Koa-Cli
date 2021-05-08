# Node Koa Cli

Quickly build koa project, generate restful API, and quickly build background management template.

# About
It is not only the project building tool of KOA, but also can quickly generate restful API and the most basic background management template. You only need to input one line of command and write some configuration files. Node koa cli will help you complete all the repetitive things.

# Translations
* [English](https://github.com/tangzihan-git/Node-Koa-Cli/tree/master)
* [中文文档](https://github.com/tangzihan-git/Node-Koa-Cli/blob/master/README%20_zh.md)

# How to Install
```
npm install node-koa-cli -g
```
or
```
npm install node-koa-cli -d
```
# Supported arguments and commands
**Usge**

If you are installing node koa cli locally, you need to add 'npx' before the command.

**Create Koa Project**
```
koa-cli create [project]
```
This command will help you build the most basic koa skeleton.


**Generate restful API**
```
koa-cli make:curd
```
This command will generate restful API based on the configuration file under `/config/model`.

# How to write configuration file
Using cli to generate restful API automatically, you need to write the configuration file of the model under /config/model
If you previously run the command `koa cli create [porject]` and the selected database type is `MongoDB`, then cli will automatically help you create a data table
If you choose 'MySQL', then you need to use `sequlize-cli` to help you create data tables. But don't worry. No matter what database type you choose, CLI will help you generate restful API.

Here is an example of the model profile
If you need to create a data table named example and want cli to help you generate the most basic curd, you should create a new example under / config / model_ Model.js file, and write the configuration with reference to the following example
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
        uniqueDesc:'exists!'
    }
}
```

At present, the model configuration of node koa cli is very simple, with only four attributes `modelName`、`fields`、`actions`、`other`.

**fields**
`Fields` represent the fields of the data table, which accept an object to describe the field. Currently, the configurable properties are `type`, and `isunique`
`Fields.type` accepts a string indicating the type of the field. The optional values are 'string', 'number', 'Boolean'. For more data types, please refer to mongoose or sequence. Node koa cli is fully compatible with them!
The value of `fields.isunique` can only be `true / false` to indicate whether the field is unique. When the field 'isunique' is set to 'true', the field uniqueness verification will be performed every time create is performed, and the controller will generate verification logic

> Note: in mongodb mode, do not add the fields attribute in the model configuration file `_id` This will lead to unexpected problems in the program!!!


Example:
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
The above configuration will generate the following code in `/controllers/example.js`
```
async store(ctx) {
    if( await  db.Example.getExampleByName(ctx.request.body.name) ||  await  db.Example.getExampleByPhone(ctx.request.body.phone) ){
        ctx.body = new RetJson(403, 'exists!')
        return;
    }
   ...
},
```
Of course, more data format validation will be provided later.

**actions**
`actions` represent the operations of the model, including `create`,`update`,`remove`,`find`.
`actions.create` Restful style add operations are generated, and `actions.create.fields` represent fields that allow inserted data tables

Example:
```
create: {
    fields: ['name','sex']
},
```

The above configuration will generate the following code in `/controllers/example.js`

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
Update is not different from create. It is not detailed here.
The main difference between them is that update has more than one by attribute, which represents which field is used as a condition to update data.
Example:
```
actions: {
    update: {
        by: ['_id'],
        fields: ['name','sex','phone']
    },
},
```

The above configuration will generate the following code in `/model/example.js`

```
static async updateExampleById(_id,obj) {
    return new Promise(async (res,rej) => {
        const eg = await this.updateMany({ _id }, obj);
        if(eg){
            res(eg)
        }else{
            rej('fail')
        }
    })
}
```

/controller/example.js generates the following code

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
Remove is the same as upadte configuration, the only difference is that remove will generate delete operation, and remove does not support configuring fields.
**find**
Find generates a find operation.
example
```
find: {
    by:['id','name,password']
}
```

The above configuration will generate the following code in `/model/example.js`

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

/controllers/example.js generates the following code

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

> Note that if a field is set `isUnique:true`, you need to add it to the find.by array.
