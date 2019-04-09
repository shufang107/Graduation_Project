const path = require('path');
const userConfig = require('./user-config');

// 默认配置
const defaultConfig = {
  'timeout': 10000,
  'logPath': path.join(__dirname, '../../logs/'),
  'baseUrl': 'http://dev.oscart.com',
  //'baseUrl':'http://yapi.tools.oscart.com/mock/8'
  //http://yapi.tools.oscart.com/mock/8/api/test
}

// 新增配置
const config = {}

Object.assign(config, defaultConfig, userConfig);
console.log(`项目配置： ${JSON.stringify(config, null, 2)}`);

module.exports = config;
