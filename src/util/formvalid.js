'use strict'

/**
 * 数据库防SQL注入通用工具方法
 */

let antiSqlValid = (value) =>{
    let re= /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
    return re.test(value);
}
 
const formvalid = {
    antiSqlValid,
  }

export default formvalid