'use strict'
/**
 * 接口返回结果转换
 * @param {数据对象} data 
 */

let getDataTable = (data) => {
  let resultObj = {
    "result": data.items || [],//如果没有数据就返回空数组
    "totalCount": data.totalCount || 0,
    "pageSize": data.pageSize || 10, //分页大小
    "pageNo": data.pageNo || 0 //页数
  }
  return resultObj;
}

let menuTransStatus = (_this) => {
  if (
    _this.$router &&
    _this.$router.history &&
    _this.$router.history.current &&
    _this.$router.history.current.path
  ) {
    let path = _this.$router.history.current.path;
    let oldMenu = _this.menu.menuData;
    let res = [];
    for (let i in oldMenu) {
      let parants = oldMenu[i];
      let newMenu = [];
      for (let j = 0; j < parants.children.length; j++) {
        let obj = parants.children[j];
        if (obj.target === path) {
          obj.selected = true;
        } else {
          obj.selected = false;
        }
        newMenu.push(obj);
      }
      parants.children = newMenu;
      res.push(parants);
    }
    return res;
  }
}

const transform = {
  getDataTable: getDataTable,
  menuTransStatus:menuTransStatus
}
export default transform
