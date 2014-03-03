module.exports = {
    /*分析主题权重*/
    'topic-weight': {
        'reg': /<i class="W8_imgicons W8_icon_good" .*?><\/i>\({0,1}(\d+){0,1}\){0,1}(?:.|\n)*?<i class="W_spetxt">(\d+)?<\/i>(?:.|\n)*?<i class="W_spetxt">(\d+)?<\/i>(?:.|\n)*?<i class="W_spetxt">(\d+)?<\/i>/g,
        'mapping': { 'good': 1, 'all': 2, 'week': 3, 'day': 4 }
    },
    'weibo-item': {
        'reg': /<a usercard=\\"id=(\d|\w+)\\" .*? href=\\"(.*?)\\">(.*?)(?:<i class=.*?i>){0,1}<\\\/a>\\uff1a<em .*?>(?:<a .*?a>){0,1}(.*?)<\\\/em><\\\/p>.*?<span class=\\"time W_textc\\"><a .*? href=\\"(.*?)\\">(.*?)<\\\/a><\\\/span>.*?<span class=\\"from W_textc\\">.*?<a .*?>(.*?)<\\\/a><\\\/span>.*?<i class=\\"W8_imgicons W8_icon_good\\"><\\\/i>\({0,1}(\d+){0,1}\){0,1}<\\\/a>.*?\\u8f6c\\u53d1\({0,1}(\d+){0,1}\){0,1}.*?\\u8bc4\\u8bba\({0,1}(\d+){0,1}\){0,1}/g,
        'mapping': { 'usrid': 1, 'homepage': 2, 'nickname': 3, 'content': 4, 'url': 5, 'time': 6, 'from': 7, 'good': 8, 'share': 9, 'reply': 10 }
    }
};