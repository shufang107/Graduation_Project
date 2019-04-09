let interceptor = require('./middleware/interceptor');
let router = require('./router/router');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let axios = require('axios');
let net = require('./util/net');

let init = function(app) {
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.use(cookieParser())
    
    // 自定义 axios 
    net(axios);

    // 自定义路由
    router(app)

    // '/api/*'路由拦截器
    interceptor(app)
}

module.exports = init;