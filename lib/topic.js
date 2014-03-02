var fs = require('fs');
var path = require('path');
var url = require('url');
var util = require('util');
var async = require('async');
var reg = require('./reg.js');
var request = require('./request.js');

var service = {
    /*根据主题获取ID*/
    name2id: 'http://huati.weibo.com/k/%s',
    /*获取热词的ID*/
    word2id: 'http://data.weibo.com/index/ajax/hotword?word=%s&flag=nolike&_t=0&__rnd=1393753221382',
    /*典型指数（维度：日）*/
    exponent: 'http://data.weibo.com/index/ajax/hotwordExponent?wid=%s&begin=%s&end=%s',
    /*时间指数（维度：小时）*/
    time: 'http://data.weibo.com/index/ajax/gettimeindex?wid=%s&date=%s&starthour=00&endhour=24',
    /*权重*/
    weigth: 'http://huati.weibo.com/%s?filter=mining',
    /*热门微博*/
    hot: 'http://huati.weibo.com/aj_topic/list?_pv=1&keyword=%s&topicName=%s&ori=0&hasv=0&atten=0&match_area=0&mining=1&istag=2&p=1&page_step=2&show_num=16&tid=%s&_t=0&__rnd=1393674047843',
    /*最新微博*/
    latest: 'http://huati.weibo.com/aj_topic/list?_pv=1&keyword=%s&topicName=%s&ori=1&hasv=0&atten=0&match_area=0&mining=0&istag=2&is_olympic=0&p=1&page_step=2&show_num=16&tid=%s&_t=0&__rnd=1393735100364'
};

/**
* @param {Integer} id 话题的ID。
*/
function Topic(id, name){
    this.id = id;
    this.name = name;
    this.wordId = 0;
}
Topic.prototype = {
    /*
    * 获取话题权重。
    */
    getWeigth: function(callback){
        var id = this.id,
            name = this.name;
        var options = util.format(service.weigth, id);
        request.get(options, function(content){
            var data = reg.filter('topic-weight', content);
            callback({ id: id, name: name }, data);
        });
    },
    getHotList: function(callback){
        this.getList(service.hot, callback);
    },
    getLatestList: function(callback){
        this.getList(service.latest, callback);
    },
    getExponentIndex: function(callback, begin, end){
        var id = this.id,
            name = this.name;
            wordId = this.wordId,
            options = util.format(service.exponent, wordId, begin, end);
        
        request.get(options, function(content){
            var result = [];
            if (content) {
                var json = JSON.parse(content);
                if (json.result) {
                    for(var key in json.result)
                    result = json.result[key];
                };
            };
            callback({ id: id, name: name }, result);
        });        
    },
    getTimeIndex: function(callback, date){
        var id = this.id,
            name = this.name;
            wordId = this.wordId,
            options = util.format(service.time, wordId, date);
        
        request.get(options, function(content){
            var result = [];
            if (content) {
                var json = JSON.parse(content);
                if (json.data) {
                    result = json.data;
                };
            };
            callback({ id: id, name: name }, result);
        });        
    },
    getList: function(format, callback){
        var id = this.id,
            name = this.name,
            encode_name = encodeURIComponent(this.name);
        var options = {},
            params = url.parse(util.format(format, encode_name, encode_name, id));
        options['host'] = params['host'];
        options['path'] = params['path'];
        options['headers'] = this.getHeaders(id);
        request.get(options, function(content){
            var data = reg.filter('weibo-item', content);
            callback({ id: id, name: name }, data);
        });        
    },
    getHeaders: function(id){
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': util.format('http://huati.weibo.com/%s?filter=mining', id),
            'Cookie': 'SINAGLOBAL=7925215171145.914.1393672251265; ULV=1393672427682:2:2:2:1637999788377.6477.1393672427623:1393672251314; __utma=3067689.1619589157.1393672252.1393672252.1393672252.1; __utmb=3067689.1.10.1393672252; __utmz=3067689.1393672252.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); HT=usr14167; _s_tentry=-; Apache=1637999788377.6477.1393672427623',    
            'Connection': 'keep-alive'
        };
    }
};

function getTopicId(callback, name){
    var encode_name = encodeURIComponent(name),
        options = util.format(service.name2id, encode_name);
    
    request.headers(options, function(headers){
        var topicId = 0;
        if (headers['location']) {
            topicId = headers['location'].substring(1);
        };
        callback(null, topicId);
    });        
}
function getWordId(callback, name){
    var encode_name = encodeURIComponent(name),
        encode_name = encodeURIComponent(encode_name),
        options = util.format(service.word2id, encode_name);

    request.get(options, function(content){
        var wordId = 0;
        if (content) {
            var json = JSON.parse(content);
            if (json.data && json.data.id) {
                wordId = json.data.id;
            };
        };
        callback(null, wordId);
    });        
}

Topic.create = function(callback, name, id){
    if (id) {
        callback(new Topic(id, name));
    }else{
        async.parallel({
            topicId: function(cb){
                getTopicId(cb, name);
            },
            wordId: function(cb){
                getWordId(cb, name);
            }
        },
        function(err, results){
            var topic,
                topicId = results['topicId'],
                wordId = results['wordId'];
            if(topicId){
                topic = new Topic(topicId, name);
                topic.wordId = wordId;
            }
            callback(topic);
        });
    }
};

module.exports = Topic;