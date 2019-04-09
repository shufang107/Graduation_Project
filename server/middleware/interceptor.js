let config = require('../config');
let axios = require('axios');
let log4js = require('../log').getLogger();

module.exports = (app) => {
  app.use('/statistics/*', function (req, res, next) {
    let query = req.query ? req.query : req.body,
      method = req.method,
      baseUrl = `${config.baseUrl}${req.baseUrl.replace(/^\/api\//, '\/')}`,
      timeout = config.timeout || 10000;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // if (req && req.headers && req.headers['content-type'] !== undefined) {
    //   headers['Content-Type'] = req.headers['content-type']
    // }
    let body = req.body;
    let option = {
      method: method,
      url: baseUrl,
      timeout: timeout,
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: headers
    }

    console.log(option);
    if (method.toLocaleLowerCase() == 'get') {
      option.params = query;
    } else {
      option.data = body;
    }

    axios(option)
      .then(function (response) {
        res.send(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          console.log(JSON.stringify(error));
          log4js.error('Error', `${error.response.data} ${error.response.status} ${error.response.headers}`);
        } else {
          log4js.error('Error', error.message);
        }
        res.send({
          code: -1000,
          data: error,
          msg: error.message
        });
      });
  })

  app.use('/docking/*', function (req, res, next) {
    let query = req.query ? req.query : req.body,
      method = req.method,
      baseUrl = `${config.baseUrl}${req.baseUrl.replace(/^\/api\//, '\/')}`,
      timeout = config.timeout || 10000;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // if (req && req.headers && req.headers['content-type'] !== undefined) {
    //   headers['Content-Type'] = req.headers['content-type']
    // }
    let body = req.body;
    let option = {
      method: method,
      url: baseUrl,
      timeout: timeout,
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: headers
    }

    console.log(option);
    if (method.toLocaleLowerCase() == 'get') {
      option.params = query;
    } else {
      option.data = body;
    }

    axios(option)
      .then(function (response) {
        res.send(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          console.log(JSON.stringify(error));
          log4js.error('Error', `${error.response.data} ${error.response.status} ${error.response.headers}`);
        } else {
          log4js.error('Error', error.message);
        }
        res.send({
          code: -1000,
          data: error,
          msg: error.message
        });
      });
  })

  app.use('/base/*', function (req, res, next) {
    let query = req.query ? req.query : req.body,
      method = req.method,
      baseUrl = `${config.baseUrl}${req.baseUrl.replace(/^\/api\//, '\/')}`,
      timeout = config.timeout || 10000;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (req && req.headers && req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type']
    }

    let body = req.body;

    let option = {
      method: method,
      url: baseUrl,
      timeout: timeout,
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: headers
    }

    console.log(option);
    if (method.toLocaleLowerCase() == 'get') {
      option.params = query;
    } else {
      option.data = body;
    }

    axios(option)
      .then(function (response) {
        res.send(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          console.log(JSON.stringify(error));
          log4js.error('Error', `${error.response.data} ${error.response.status} ${error.response.headers}`);
        } else {
          log4js.error('Error', error.message);
        }
        res.send({
          code: -1000,
          data: error,
          msg: error.message
        });
      });
  })
}
