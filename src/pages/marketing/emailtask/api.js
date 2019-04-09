'use strict'
const api = {
    "postage_query":"/docking/admin/ruleFreePost/query",
    "postage_create":"/docking/admin/ruleFreePost/create",
    "freepost_query":"/docking/admin/ruleActivityFreePost/queryList",
    "freepost_query_status":"/docking/admin/ruleActivityFreePost/queryStatusList",
    "freepost_online":"/docking/admin/ruleActivityFreePost/online",
    "freepost_offline":"/docking/admin/ruleActivityFreePost/offline",
    "freepost_delete":"/docking/admin/ruleActivityFreePost/delete",
    "freepost_create":"/docking/admin/ruleActivityFreePost/create",
    "freepost_update":"/docking/admin/ruleActivityFreePost/update",
    "get_special": "/base/special/admin/get_special", //获取专场列表
}
export default api