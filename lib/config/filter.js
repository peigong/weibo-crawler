module.exports = {
    /*分析主题权重*/
    'topic-weight': {
        'reg': /<i class="W8_imgicons W8_icon_good" .*?><\/i>\({0,1}(\d+){0,1}\){0,1}(?:.|\n)*?<i class="W_spetxt">(\d+)?<\/i>(?:.|\n)*?<i class="W_spetxt">(\d+)?<\/i>(?:.|\n)*?<i class="W_spetxt">(\d+)?<\/i>/g,
        'mapping': { 'good': 1, 'all': 2, 'week': 3, 'day': 4 }
    },
    /*抓取微博列表*/
    'weibo-item': {
        'reg': /<a usercard=\\"id=(\d|\w+)\\" .*? href=\\"(.*?)\\">(.*?)(?:<i class=.*?i>){0,1}<\\\/a>\\uff1a<em .*?>(?:<a .*?a>){0,1}(.*?)<\\\/em><\\\/p>.*?<span class=\\"time W_textc\\"><a .*? href=\\"(.*?)\\">(.*?)<\\\/a><\\\/span>.*?<span class=\\"from W_textc\\">.*?<a .*?>(.*?)<\\\/a><\\\/span>.*?<i class=\\"W8_imgicons W8_icon_good\\"><\\\/i>\({0,1}(\d+){0,1}\){0,1}<\\\/a>.*?\\u8f6c\\u53d1\({0,1}(\d+){0,1}\){0,1}.*?\\u8bc4\\u8bba\({0,1}(\d+){0,1}\){0,1}/g,
        'mapping': { 'usrid': 1, 'homepage': 2, 'nickname': 3, 'content': 4, 'url': 5, 'time': 6, 'from': 7, 'good': 8, 'share': 9, 'reply': 10 }
    },
    /*抓取twitter搜索结果列表*/
    'tweet-list-search': {
        'reg': /data-tweet-id="(\d+)?"(?:.|\n)*?data-screen-name="(.+)?" data-name="(.+)?" data-user-id="(\d+)?"/g,
        'mapping': { 'tweet-id': 1, 'screen-name': 2, 'name': 3, 'user-id': 4, 'time-desc': 5, 'timestamp': 6 }
    },
    /*抓取twitter的推文转发和收藏数*/
    'tweet-batch': {
        'reg': /Retweeted (\d+) times.*?Favorited (\d+) times/g,
        'mapping': { 'retweet': 1, 'favorite': 2}
    },
    /*抓取twitter的用户信息*/
    'twitter-profile': {
        'reg': /<span class="location profile-field">((.|\n)*?)<\/span>/g,
        'mapping': { 'location': 1 }
    }
};

/*
收藏数和转发数有一个即需要统计，当前的正则不合理。

有的推文有时间，有的没有。正则需要再推敲
(?:.|\n)*? (title="(.+)?" .*? data-time="(\d+)?".*?>){0,1}
*/