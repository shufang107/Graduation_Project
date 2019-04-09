import axios from 'axios';

// 添加请求拦截器
axios.interceptors.response.use(function (response) {
  // 在发送请求之前
  return response.data;
}, function (error) {
  // 响应错误
  return Promise.reject(error);
});

module.exports = axios

