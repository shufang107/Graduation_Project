let menudata = [{
    name: 'nav 1',
    href: '/dash/home',
    children: [{
        name: 'subnav 1',
        icon: 'user',
        children: [{
            name: 'option1',
            href: '/dash/home'
        },{
            name: 'option2',
            href: '/dash/subnav1option2'
        }]
    }, {
        name: 'subnav 2',
        icon: 'laptop',
        children: [{
            name: 'option1',
            href: '/dash/subnav2option1'
        },{
            name: 'option2',
            href: '/dash/subnav2option2'
        },{
            name: 'option3',
            href: '/dash/subnav2option3'
        },{
            name: 'option4',
            href: '/dash/subnav2option4'
        }]
    }]
}, {
    name: 'nav 2',
    href: '/dash/home',
    children: [{
        name: 'subnav 2',
        icon: 'user',
        children: [{
            name: 'option1'
        },{
            name: 'option2'
        },{
            name: 'option3'
        },{
            name: 'option4'
        }]
    }]
}]

let getNav = () => {
    let [data, temp] = [menudata, []];
    for(let i = 0, len = data.length; i < len; i++) {
        // delete data[i]['children'];
        temp.push({
            name: data[i].name,
            href: data[i].href
        });
    }
    return temp;
}

let getMenuByUrl = (url) => {
    for( let i in menudata ) { // 一级菜单
        // console.log(menudata[i])
        for(let j in menudata[i].children) { // 二级菜单
            // console.log(menudata[i].children[j])
            for(let x in menudata[i].children[j].children) {
                // console.log(menudata[i].children[j].children[x])
                let item = menudata[i].children[j].children[x];
                if(item.href == url) {
                    return {
                        items: menudata[i].children || [],
                        nav: {
                            name: menudata[i].name
                        }
                    }
                }
                break;
            }
        }
    }
    return {
        items: [],
        nav: {
            name: ''
        }
    }
}

module.exports = {
    menudata: menudata,
    getNav: getNav,
    getMenuByUrl: getMenuByUrl
}