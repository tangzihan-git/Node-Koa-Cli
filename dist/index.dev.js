#!/usr/bin/env node
"use strict";

var glob = require('glob');

var path = require('path');

var fs = require('fs');

var os = require('os');

var _require = require('../../node_koa.config'),
    ConfigModelRoot = _require.ConfigModelRoot; //模型配置文件根目录


var root = path.join(__dirname, '../../');
var ModelRoot = path.resolve('./models'); // 模型文件的根路径

var RouterRoot = path.resolve('./router'); // 路由文件根路径

var ControllerRoot = path.resolve('./controllers'); // 控制器文件的根路径

var _require2 = require('./lib/makeModel'),
    generateModelMethods = _require2.generateModelMethods,
    generateControllerMethods = _require2.generateControllerMethods,
    generateRouterMethods = _require2.generateRouterMethods; // 生成模型方法


var modelTemplate = require('./templates/model_template'); // 模型模板文件


var controllerTemplate = require('./templates/controller_template'); // 控制器模板文件


var routerTemplate = require('./templates/router_template'); // 路由模板文件


var routerStaticTemplate = require('./templates/router_static_template'); // 静态路由模板文件


var appTemplate = require('./templates/app_template'); // 入口文件模板文件


var models = glob.sync("".concat(ConfigModelRoot, "/**/*_model.js")); // 获取所有模型配置文件

function generateModel() {
  var absoluteRoot;
  return regeneratorRuntime.async(function generateModel$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fs.mkdirSync("".concat(root, "/models"), {
            recursive: true
          }));

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(fs.mkdirSync("".concat(root, "/controllers"), {
            recursive: true
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(fs.mkdirSync("".concat(root, "/router"), {
            recursive: true
          }));

        case 6:
          absoluteRoot = os.platform() === 'win32' ? ConfigModelRoot.replace(/\\/ig, '/') : ConfigModelRoot;
          models.forEach(function _callee(f) {
            var ctrlClass, modelName;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    ctrlClass = require(f); // 去掉控制器绝对路径部分，去掉控制器_model后缀，生成一个模型名称

                    modelName = f.replace(absoluteRoot, '').replace('/', '').replace(/\_|model/g, ''); // 将生成好的模型写入文件

                    fs.writeFile("".concat(ModelRoot, "/").concat(modelName), modelTemplate(ctrlClass, generateModelMethods(ctrlClass)), function (err) {
                      if (err) throw err;
                      console.log("\u6A21\u578B\uFF1A".concat(modelName, "\u751F\u6210\u6210\u529F"));
                    }); // 将生成好的控制器写入文件

                    generateController(ControllerRoot, modelName, controllerTemplate(generateControllerMethods(ctrlClass)));

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }); // 生成路由文件控制器引用,并写入路由文件

          generateRouter(RouterRoot, routerTemplate(generateRouterMethods(models))); // 用户是否配置了静态文件路由

          generateStaticRouter(RouterRoot, routerStaticTemplate()); // 生成入口文件

          generateApp(root, appTemplate());

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function generateController(root, controllerName, content) {
  return regeneratorRuntime.async(function generateController$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          fs.writeFile("".concat(root, "/").concat(controllerName), content, function (err) {
            if (err) throw err;
            console.log("\u63A7\u5236\u5668\uFF1A".concat(controllerName, "\u751F\u6210\u6210\u529F"));
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function generateRouter(root, content) {
  return regeneratorRuntime.async(function generateRouter$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          fs.writeFile("".concat(root, "/index.js"), content, function (err) {
            if (err) throw err;
            console.log("\u8DEF\u7531\uFF1Aindex.js \u751F\u6210\u6210\u529F");
          });

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function generateStaticRouter(root, content) {
  return regeneratorRuntime.async(function generateStaticRouter$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          fs.writeFile("".concat(root, "/static.js"), content, function (err) {
            if (err) throw err;
            console.log("\u9759\u6001\u6587\u4EF6\u8DEF\u7531\uFF1Astatic.js \u751F\u6210\u6210\u529F");
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function generateApp(root, content) {
  return regeneratorRuntime.async(function generateApp$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          fs.writeFile("".concat(root, "/app.js"), content, function (err) {
            if (err) throw err;
            console.log("\u5165\u53E3\u6587\u4EF6\uFF1Aapp.js \u751F\u6210\u6210\u529F");
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}

generateModel();