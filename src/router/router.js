const index = resolve => require(['@/pages/index/index'], resolve);

//登录页面
//import login from '@/pages/login/login'
const login = resolve => require(['@/pages/login/login'], resolve);

//运营模块
// import operate from '@/pages/operate/operate'
const operate = resolve => require(['@/pages/operate/operate'],resolve);
const operateSpugoods = resolve => require(['@/pages/operate/spugoods/spugoods'],resolve);
const operateSkugoods = resolve => require(['@/pages/operate/skugoods/skugoods'],resolve);
const operateProduct = resolve => require(['@/pages/operate/product/product'],resolve);
// const operateFlashsale = resolve => require(['@/pages/operate/flashsale/flashsale'],resolve);
// const operateAdvertisement = resolve => require(['@/pages/operate/advertisement/advertisement'],resolve);
// const operateGift = resolve => require(['@/pages/operate/gift/gift'],resolve);
// const operateGiftsale = resolve => require(['@/pages/operate/giftsale/giftsale'],resolve);

//客户模块
const user = resolve => require(['@/pages/user/user'], resolve);
const userRegisters = resolve => require(['@/pages/user/registers/registers'], resolve);
const userNormalusers = resolve => require(['@/pages/user/normalusers/normalusers'], resolve);
const userPartners = resolve => require(['@/pages/user/partners/partners'], resolve);
const userPortrait = resolve => require(['@/pages/user/portrait/portrait'], resolve);
const userOrders = resolve => require(['@/pages/user/orders/orders'], resolve);
const userLogistics = resolve => require(['@/pages/user/logistics/logistics'], resolve);
const userAssets = resolve => require(['@/pages/user/assets/assets'], resolve);
const userBalance = resolve => require(['@/pages/user/balance/balance'], resolve);
const teamRule = resolve => require(['@/pages/user/teamRule/teamRule'], resolve);
const teamList = resolve => require(['@/pages/user/teamList/teamList'], resolve);
const teamProfit = resolve => require(['@/pages/user/teamProfit/teamProfit'], resolve);


//系统模块
const system = resolve => require(['@/pages/system/system'], resolve);
const systemAccounts = resolve => require(['@/pages/system/accounts/accounts'], resolve);


//营销模块
const marketing = resolve => require(['@/pages/marketing/marketing'], resolve);
const marketingEmailtask = resolve => require(['@/pages/marketing/emailtask/emailtask'], resolve);
const marketingActivitymanagement = resolve => require(['@/pages/marketing/activitymanagement/activitymanagement'], resolve);

//统计模块
const count = resolve => require(['@/pages/count/count'],resolve);
const countShopownerenroll = resolve => require(['@/pages/count/shopownerenroll/shopownerenroll'],resolve);
const countOrderdata = resolve => require(['@/pages/count/orderdata/orderdata'],resolve);
const countSalesdata = resolve => require(['@/pages/count/salesdata/salesdata'],resolve);
const countShopmansalesdata = resolve => require(['@/pages/count/shopmansalesdata/shopmansalesdata'],resolve);
const countUserpurchasedata = resolve => require(['@/pages/count/userpurchasedata/userpurchasedata'],resolve);
const countTeamfissiondata = resolve => require(['@/pages/count/teamfissiondata/teamfissiondata'],resolve);
const countShopmansalesrank = resolve => require(['@/pages/count/shopmansalesrank/shopmansalesrank'],resolve);
// const countGoodssalesrank = resolve => require(['@/pages/count/goodssalesrank/goodssalesrank'],resolve);

export default [
    {
        path: '/index',
        component: index,
        name: 'index',
    },
    {
        path: '/operate',
        component: operate,
        name: 'operate',
        children:[
            {
                name:'operate-spugoods',
                path: 'operate-spugoods',
                component:operateSpugoods
            },
            {
                name:'operate-skugoods',
                path: 'operate-skugoods',
                component:operateSkugoods
            },
            {
                name:'operate-product',
                path: 'operate-product',
                component:operateProduct
            },
            // {
            //     name:'operate-flashsale',
            //     path: 'operate-flashsale',
            //     component:operateFlashsale 
            // },
            // {
            //     name:'operate-advertisement',
            //     path: 'operate-advertisement',
            //     component:operateAdvertisement
            // },
            // {
            //     name:'operate-gift',
            //     path: 'operate-gift',
            //     component:operateGift
            // },
            // {
            //     name:'operate-giftsale',
            //     path:'operate-giftsale',
            //     component:operateGiftsale
            // }
        ]
    },

    {
        path: '/user',
        component: user,
        name: 'user',
        children:[
            {
                name:'user-registers',
                path: 'user-registers',
                component:userRegisters
            },
            {
                name:'user-normalusers',
                path: 'user-normalusers',
                component:userNormalusers
            },
            {
                name:'user-partners',
                path: 'user-partners',
                component:userPartners
            },
            {
                name:'user-portrait',
                path: 'user-portrait',
                component:userPortrait
            },
            {
                name:'user-orders',
                path: 'user-orders',
                component:userOrders
            },
            {
                name:'user-logistics',
                path: 'user-logistics',
                component:userLogistics
            },
            {
                name:'user-assets',
                path: 'user-assets',
                component:userAssets
            },
            {
                name:'user-balance',
                path: 'user-balance',
                component:userBalance
            },
            {
                name:'team-rule',
                path: 'team-rule',
                component:teamRule
            },
            {
                name:'team-list',
                path: 'team-list',
                component:teamList
            },
            {
                name:'team-profit',
                path: 'team-profit',
                component:teamProfit
            },
        ]
    },
    {
        path: '/system',
        component: system,
        name: 'system',
        children:[
            {
                name:'system-accounts',
                path: 'system-accounts',
                component:systemAccounts
            }
        ]
    },
    {
        path: '/marketing',
        component: marketing,
        name: 'marketing',
        children:[
            {
                name:'marketing-emailtask',
                path: 'marketing-emailtask',
                component:marketingEmailtask
            },
            {
                name:'marketing-activitymanagement',
                path: 'marketing-activitymanagement',
                component:marketingActivitymanagement 
            },
        ]
    },
    {
        path: '/count',
        component: count,
        name: 'count',
        children: [
            {
                name: 'count-shopownerenroll',
                path: 'count-shopownerenroll',
                component: countShopownerenroll,
            },
            {
                name: 'count-orderdata',
                path: 'count-orderdata',
                component: countOrderdata,
            },
            {
                name: 'count-salesdata',
                path: 'count-salesdata',
                component:countSalesdata
            },
            {
                name: 'count-shopmansalesdata',
                path: 'count-shopmansalesdata',
                component:countShopmansalesdata
            },
            {
                name: 'count-userpurchasedata',
                path: 'count-userpurchasedata',
                component:countUserpurchasedata
            },
            {
                name: 'count-teamfissiondata',
                path: 'count-teamfissiondata',
                component:countTeamfissiondata
            },
            {
                name: 'count-shopmansalesrank',
                path: 'count-shopmansalesrank',
                component:countShopmansalesrank
            },
            // {
            //     name: 'count-goodssalesrank',
            //     path: 'count-goodssalesrank',
            //     component:countGoodssalesrank
            // },

        ]
    },
    {
        path: '/login',
        component: login,
        name: 'login',
    },
    { path: '*', redirect: '/index' }
]
