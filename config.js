module.exports = {
    /*分析热点微博*/
    "hotWeibo": {
        /*热门微博-相关网页*/
        "regList": /\\u70ed\\u95e8\\u5fae\\u535a(.+)\\u76f8\\u5173\\u7f51\\u9875/,
        /*转发 收藏 评论*/
        "regItem": /\\u8f6c\\u53d1\((\d+)\).+?\\u8bc4\\u8bba\((\d+)\)/g,
        "config": { "relayCount": 1, "commentCount": 2 }
    },
    /*分析相关网页*/
    "relatedWeb": {
        /*相关网页-实时微博*/
        "regList": /\\u76f8\\u5173\\u7f51\\u9875(.+)\\u5b9e\\u65f6\\u5fae\\u535a/,
        /*年 月 日*/
        "regItem": /(\d{4})\\u5e74(\d{1,2})\\u6708(\d{1,2})\\u65e5/g,
        "config": { "year": 1, "month": 2, "day": 3 }
    },
    "realTimeWeibo": {
        /*实时微博*/
        "regList": /\\u5b9e\\u65f6\\u5fae\\u535a(.+)/,
        /*转发 收藏 评论*/
        "regItem": /\\u8f6c\\u53d1\((\d+)\).+?\\u8bc4\\u8bba\((\d+)\)/g,
        "config": { "relayCount": 1, "commentCount": 2 }
    }
};