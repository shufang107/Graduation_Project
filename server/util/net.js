
let log4js = require('../log').getLogger();

module.exports = function(axios) {
    // 添加请求拦截器
    axios.interceptors.response.use(function (response) {
        // 在发送请求之前
        log4js.info('BASE SERVICE:', `${response.config.method} ${response.config.url}`);
        return response;
    }, function (error) {
        // 响应错误
        return Promise.reject(error);
    });
}