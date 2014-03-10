var url = require('url');
var util = require('util');

var logger = require('./logger.js');
var reg = require('./reg.js');
var request = require('./request.js');

var service = {
    'crowd': 'http://index.baidu.com/?tpl=crowd&word=%s',
    'region': 'http://index.baidu.com/Interface/Region/getRegion/?res=%s&res2=%s',
    'interest': 'http://index.baidu.com/Interface/Interest/getInterest/?res=%s&res2=%s',
    'social': 'http://index.baidu.com/Interface/Social/getSocial/?res=%s'//&res2=%s
};

function getHeaders(word){
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
        //'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': util.format('http://index.baidu.com/?tpl=crowd&word=%s', word),
        'Cookie': 'BAIDUID=FE93EADB76C6BB57EA8A9BE5582908C6:FG=1; BDUSS=FHTGt2WlJxY0otUUtZR0JSTX53THlDMWVDNH5MNnhQbH5zdHhxSEwzajF0MEJUQVFBQUFBJCQAAAAAAAAAAAEAAADeHG8MeWlsYWIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUqGVP1KhlTWH; Hm_lvt_d101ea4d2a5c67dab98251f0b5de24dc=1394193015,1394193046,1394200451,1394202286; Hm_lpvt_d101ea4d2a5c67dab98251f0b5de24dc=1394202286; bdshare_firstime=1394158042549; CHKFORREG=85eaacfabe36e41e61051b3c188d81d9',    
        'Connection': 'keep-alive'
    };
}

function Baidu(query, ppt){
    this.query = query;
    this.ppt = ppt;
}
Baidu.prototype = {
    getRegionIndex: function(from, to, callback){
        var that = this;
        var query = that.query,
            options = util.format(service.timeline, encodeURIComponent(query), from, to);
        
        request.sget(options, function(content){
            var data = reg.filter('tweet-timeline', content);
            callback(that.query, data);
        });        
    },
    getInterestIndex: function(id, callback){
        var that = this;
        var options = util.format(service.batch, id);
        
        request.sget(options, function(content){
            var data = reg.filter('tweet-batch', content);
            callback(id, data);
        });        
    },
    getSocialIndex: function(callback){
        var that = this;
        var query = that.query,
            ppt = that.ppt,
            options = {},
            params = url.parse(util.format(service.social, encodeURIComponent(ppt)));
logger.trace(ppt);
        options['host'] = params['host'];
        options['path'] = params['path'];
        options['headers'] = getHeaders(query);
        //logger.trace(options.path);
        request.get(options, function(content){
        
        //request.get(options, function(content){
            logger.trace(content);
            /*var result = [];
            if (content) {
                var json = JSON.parse(content);
                if (json.result) {
                    for(var key in json.result)
                    result = json.result[key];
                };
            };
            callback(that.query, data);*/
        });        
    }
};

Baidu.create = function(callback, query){
    var options = {},
        params = url.parse(util.format(service.crowd, query));
    options['host'] = params['host'];
    options['path'] = params['path'];
    options['headers'] = getHeaders(query);
    request.getGBK(options, function(content){
        var data = reg.filter('baidu-ppt', content);
        logger.trace(data.ppt);
        var data_test = reg.filter('baidu-ppt-test', content);
        logger.trace(data_test.ppt);
        var baidu = new Baidu(query, data.ppt);
        callback(baidu);
    });        
}

module.exports = Baidu;