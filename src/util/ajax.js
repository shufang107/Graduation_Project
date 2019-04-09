import axios from 'axios';
const ajax = (function() {
    /**
     * [baseAjax ajax基础请求方法]
     * @param  {[type]} option    [基础请求参数（method，data，url）]
     * @param  {[type]} successFn [请求成功执行函数]
     * @param  {[type]} errorFn   [请求失败执行函数]
     * @return {[type]}           [description]
     */
    var baseAjax = (option, successFn, errorFn) => {
            let defaultOption = {
                method: 'get',
                url: '',
                baseURL: '',
                timeout: 1000 * 60 * 2
            }
            Object.assign(defaultOption, option);
            //console.log(defaultOption)
            //console.log(defaultOption.url)
            //defaultOption.url = defaultOption.url;
            return axios(defaultOption)
                .then(response => {
                    //console.log(response.data)
                    let data = response.data;
                    if (data.code == 200) {
                        successFn && successFn(data.result)
                       
                    } else {
                        if (data.code == 10) {
                            location.href = location.pathname;
                            return;
                        }
                        errorFn && errorFn(data);
                        //console.log('错误',errorFn)
                    }
                })
                .catch(error => {
                    errorFn && errorFn(error)
                })
            }
        /**
         * [post post方式请求方法]
         * @param  {[type]} url       [请求url]
         * @param  {[type]} data      [请求传参]
         * @param  {[type]} successFn [请求成功执行函数]
         * @param  {[type]} errorFn   [请求失败执行函数]
         * @return {[type]}           [description]
         */
    var post = (url, data, successFn, errorFn) => {
            let opt = {
                url: url,
                method: 'post',
                data: data
            }
            opt.url = opt.url;
            baseAjax(opt, successFn, errorFn)
        }
        /**
         * [get get方式请求方法]
         * @param  {[type]} url       [请求url]
         * @param  {[type]} successFn [请求成功执行函数]
         * @param  {[type]} errorFn   [请求失败执行函数]    
         * @return {[type]}           [description]
         */
    var get = (url, data, successFn, errorFn) => {
            let opt = {
                url: url,
                method: 'get',
                params: data
            }
            opt.url =  opt.url;
            console.log(opt);
            baseAjax(opt, successFn, errorFn)
        }
      
    return {
        post: post,
        get: get,
        base: baseAjax
    }
})()
export default ajax