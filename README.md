# foundation-admin

> ### 简版后台
> node >= 10.13.0

## 1、本地安装启动
----
``` bash
# 安装依赖 
$ npm install

$ npm install supervisor -g

# 启动中间层与前端静态资源服务
$ npm run dev
```
访问 http://localhost:8080/ 便可以查看后台


## 2、日志规范
----
参考：[http://wiki.corp.vipshop.com/pages/viewpage.action?pageId=582583692](http://wiki.corp.vipshop.com/pages/viewpage.action?pageId=582583692) 

## 3、本地开发环境说明
----
目前项目配置是 server/config/index.js，默认是本地研发环境的配置，如有增删需对应维护
除了默认配置，平常开发中可能需频繁修改配置，不建议直接修改该文件

现在项目通过读取环境变量中的 FOUNDATION_ADMIN_CONFIG，读取文件对默认配置进行覆盖（修改环境变量需重启服务），例如：

export FOUNDATION_ADMIN_CONFIG="/Users/mac/projects/foundation-admin/test-config.js"
```bash
# 参考 server/config/index.js 进行配置
{
    'timeout': 10000,
	'logPath': path.join(__dirname, '../../logs/'),
	'baseUrl': 'http://rap.vipme.com/mockjsdata/25'
}
# 用于请求后端服务，如需要，可自行修改为对应IP/域名，修改后请勿提交
baseHost: 'http://10.199.252.237:8080/mockjsdata/25/'
# 中间层请求超时
timeout: 1000
...
```

## 4、路由配置
----
### 4.1、路由转发规则
----
匹配规则：**前台请求以 '/api/*' 开头的路径将会被转发** 例如

`/api/shoppingcart/api/add_v2`

转发的路径为：
```bash
`${baseUrl}/shoppingcart/api/add_v2`
# baseUrl 中间层配置文件中设置，配置参考本地开发环境说明
```
### 4.2、自定义路由
----
#### 目录结构
+ /router
    + /router.js (接口入口文件))
    + /test (定义接口的文件夹)
        + /index.js
    + ...

router.js 入口文件
```bash
module.exports = app => {
    require('./test')(app)
}
```

**`/test 自定义一个接口的文件夹，文件名即为接口名`**

test/index.js 接口处理逻辑
```bash
module.exports = app => {
    app.get('/api/test', function (req, res, next) {
        res.send({
            code: 0,
            msg: 'testing'
        });
    });
}
```

## 5、PM2启动模式
----
``` bash
$ npm run pm2
```
配置文件JSON格式，采用单进程模式记录
```bash
{
    "apps": [{
        "name": "foundation",
        "script": "app.js",

        "autorestart": true,
        "max_memory_restart": "1G",
        
        "merge_logs": true,
        
        "node_args": [],
        "args": [],
        "env": {
            "NODE_ENV": "production"
        }
    }]
}
```
