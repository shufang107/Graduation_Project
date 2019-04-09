'use strict'
import config from '../../../setting/index'
const api = {
    "upload": config.baseUrl + "/specialgoods/admin/upload_special_goods_new", //导入模板
    "del_temp_special_goods": "/base/specialgoods/admin/del_temp_upload_special_goods", //根据临时专场ID删除缓存数据
    "get_special": "/base/special/admin/get_special", //获取专场列表数据
    "submit_singlesale": "/base/specialgoods/admin/submit_single_special_goods", //确认提交列表商品按钮
    "get_special_goods": "/base/specialgoods/admin/get_special_detail_list", //根据专场ID获取专场下的商品数据
    "load_temp_goods": "/base/specialgoods/admin/load_temp_upload_special_goods", //根据临时专场ID，获取临时专场商品数据
    "offline_special": "/base/special/admin/offline_special", //下线专场接口
    "online_special": "/base/special/admin/online_special", //上线接口
    "del_special": "/base/special/admin/del_special", //删除专场
  }
export default api