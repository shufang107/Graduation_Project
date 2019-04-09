const menus = [
    {
        key: 'index', // 首页
        name: '概况',
        target: '/index',
        selected:true,
    },
    {
        key: 'operate', // 运营
        name: 'PH值',
        target: '/operate/operate-spugoods',
        selected:false,
    },
    {
        key: 'user', // 用户
        name: '浑浊度',
        target: '/user/user-registers',
        selected:false,
    },
    // {
    //     key: 'system', // 系统
    //     name: '温度',
    //     target: '/system/system-accounts',
    //     selected:false,
    // },
    // {
    //     key: 'marketing', // 营销
    //     name: '营销',
    //     target: '/marketing/marketing-emailtask',
    //     selected:false,
    // },
    {
        key: 'count', // 统计
        name: '温度',
        target: '/count/count-shopownerenroll',
        selected:false,
    }
];

let getMenu = (key) =>{
    //console.log('!key',!key)//字符的否定是false
    if(!key){
        return menus;
    }
    let result = [];
    for(let i = 0; i< menus.length; i++){
        let item;
        if(key === menus[i].key){
            item = {
                key: menus[i].key,
                name: menus[i].name,
                target:  menus[i].target,
                selected:true,
            }
        }else{
            item = {
                key: menus[i].key,
                name: menus[i].name,
                target:  menus[i].target,
                selected:false,
            }
        }
        result.push(item);
    }
    return result
}

let getSelectedByUrl = (url) => {
    let moduleKey = '';
    let subMenuKey = '';
    let moduleItems = [];

    for (let menu of menus) { // 模块
        for (let subMenu of menu.items) { // 一级菜单
            for (let item of subMenu.items) { // 二级菜单
                if (item.url == url) {
                    moduleKey = menu.key;
                    subMenuKey = item.key;
                    moduleItems = menu.items;
                }
            }
        }
    }

    return {
        moduleKey,
        subMenuKey,
        moduleItems
    };
};

let getSelectedByModuleKey = (key) => {
    let info = [];
    for (let menu of menus) { // 模块
        if (menu.key == key) {
            let url = menu.indexUrl;
            info = getSelectedByUrl(url);
        }
    }
    return info;
};

export default {
    getMenu,
    getSelectedByUrl,
    getSelectedByModuleKey
};