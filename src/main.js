// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routerMap from './router/router'
import './lib/font-awesome-4.7.0/css/font-awesome.min.css'
import './vue-beauty.css' //引入vue-beauty UI组件
import axios from '@/lib/net'
import Cookie from "cookie.js";
import MD5 from "@/util/mdtools.js";
import vueBeauty from 'vue-beauty' //引入vue-beauty UI组件
Vue.use(vueBeauty)
Vue.use(VueRouter)

Vue.prototype.$http = axios;

const router = new VueRouter({
  mode: 'history',
  routes: routerMap
})

router.beforeEach((to, from, next) => {
  next();
  if (to.path.indexOf('login') > -1) { //表明是登录页 不需要拦截
    next();
  } else {
    //获取是否有效登录用户
    let isUser = localStorage.getItem('isUser');
    if (isUser) {
      next();
    } else {
      //都需要拦截的页面
      let username = Cookie.get('username') || '';
      let password = MD5.hexCharCodeToStr(Cookie.get('password') || '');
      axios
        .get('/docking/admin/account/logon', {
          params: {
            name: username,
            password: password
          }
        }).then(res => {
          if (res.code === 0) {
            //设置登录成功后的cookie
            localStorage.setItem('isUser', true);
            next();
          } else {
            Vue.prototype.$message.error("登录失败!!!")
            next({
              path: '/login',
            })
          }
        })
    }
  }
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
