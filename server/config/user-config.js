const fs = require('fs');

// 读取环境变量的配置文件
let userConfig = {}
if (process.env.FOUNDATION_ADMIN_CONFIG && fs.existsSync(process.env.FOUNDATION_ADMIN_CONFIG)) {
    userConfig = require(process.env.FOUNDATION_ADMIN_CONFIG);
}

module.exports = userConfig