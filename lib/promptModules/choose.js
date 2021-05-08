const inquirer = require('inquirer')
module.exports =  async ()=> {
    const mysqlLib = [
        { name: 'sequelize', value: 'sequelize' },
        { name: 'mysql2(preview)', value: 'mysql2' },
    ]
    const mongooseLib = [
        { name: 'mongoose', value: 'mongoose' },
    ]

    const { type } = await inquirer.prompt([
        {
          name: 'type',
          type: 'list',
          message: `Pick a Database Type`,
          choices: [
            { name: 'MongoDB', value: 'mongodb' },
            { name: 'MySQL', value: 'mysql' },
          ]
        }
    ])
    if (!type)return;
     const { lib } = await inquirer.prompt([
        {
            name: 'lib',
            type: 'list',
            message: `Pick a Database operation library`,
            choices: type == 'mysql' ? mysqlLib : mongooseLib
        }
    ])
    if(!lib)return;
    const { static } = await inquirer.prompt([
        {
          name: 'static',
          type: 'confirm',
          message: `Whether static file routing is required?`
        }
    ])

    const { jwt } = await inquirer.prompt([
      {
        name: 'jwt',
        type: 'confirm',
        message: `Whether JWT authorization is required?`
      }
  ])

    return {type,lib,static,jwt}
}