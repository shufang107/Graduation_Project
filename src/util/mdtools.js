'use strict'

/**
 * 获取加密字符串
 * @param {} string 
 */
import MD5 from "md5.js";

let strToHexCharCode = (str) => {
  if (str === "")
    return "";
  var hexCharCode = [];
  hexCharCode.push("0x");
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join("");
}

let hexCharCodeToStr = (hexCharCodeStr) => {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x" ?
    trimedStr.substr(2) :
    trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

/**
 * 字符串加密
 * @param {} code 
 */
let compileStr = (code) => {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}

/**
 * 字符串解密
 * @param {*} code 
 */
let unCompileStr = (code) => {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}




let getMD5 = (string) => {
  var md5stream = new MD5();
  return md5stream.update(string).digest("hex"); //加密后的密码
}


const mdtools = {
  getMD5,
  strToHexCharCode,
  hexCharCodeToStr,
  compileStr,
  unCompileStr
}
export default mdtools
