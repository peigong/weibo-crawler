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
    weigth4id: 'http://huati.weibo.com/%s?filter=mining',
    weigth4name: 'http://huati.weibo.com/k/%s?from=204',
    /*热门微博*/
    hot: 'http://huati.weibo.com/aj_topic/list?_pv=1&keyword=%s&topicName=%s&ori=0&hasv=0&atten=0&match_area=0&mining=1&istag=2&p=%s&page_step=%s&show_num=15&tid=%s&_t=0&__rnd=1393674047843',
    /*最新微博*/
    latest: 'http://huati.weibo.com/aj_topic/list?_pv=1&keyword=%s&topicName=%s&ori=1&hasv=0&atten=0&match_area=0&mining=0&istag=2&is_olympic=0&p=%s&page_step=%s&show_num=15&tid=%s&_t=0&__rnd=1393735100364'
};

/**
* @param {String} name 话题。
*/
function Topic(name){
    this.name = name;
    this.topicId = 0;
    this.wordId = 0;
    this.topN = 15;
}
Topic.prototype = {
    /*
    * 获取话题权重。
    */
    getWeigth: function(callback){
        var topicId = this.topicId,
            name = this.name;
        var options = util.format(service.weigth4name, name);
        if (topicId) {
            options = util.format(service.weigth4id, topicId);
        };
        request.get(options, function(content){
            var data = reg.filter('topic-weight', content);
            callback({ topicId: topicId, name: name }, data);
        });
    },
    getHotList: function(callback){
        this.execParallelListTasks(callback, service.hot);
    },
    getLatestList: function(callback){
        this.execParallelListTasks(callback, service.latest);
    },
    createListTask: function(format, page, step){
        var that = this;
        return function(cb){
            that.getList(cb, format, page, step);
        };
    },
    /**
    * 获取需要并行执行的列表任务。
    */
    execParallelListTasks: function(callback, format){
        var that = this, 
            /*每页可以延展的步数*/
            page_steps = 3,
            /*每步可以获取的微博条数*/
            step_counts = 15,
            /*需要获取的微博条数*/
            topN = that.topN;

        /*需要并行执行的步数*/
        var parts = Math.ceil(that.topN/step_counts);
        var tasks = [];
        for (var i = 0; i < parts; i++) {
            var dividend = i + 1;
            /*页码*/
            var page = Math.ceil(dividend / page_steps);
            /*页面中的步数*/
            var page_step = (dividend % page_steps) + 1;
            tasks.push(that.createListTask(format, page, page_step));
        };
        async.parallel(tasks, function(err, results){
            if (!err) {
                var topicId = that.topicId,
                    name = that.name;
                var data = [];
                var urls = {};
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    for (var j = 0; j < result.length; j++) {
                        var url = result[j].url;
                        if (urls.hasOwnProperty(url)) {
                            urls[url]++;
                        }else{
                            urls[url] = 1;
                            data.push(result[j]);
                        }
                    };
                };
                if ((topN > 0) && (data.length > topN)) {
                    data = data.slice(0, (topN -1));
                };
                callback({ topicId: topicId, name: name }, data);
            }
        });
    },
    getList: function(callback, format, page, step){
        page = page || 1;
        step = step || 1;
        var topicId = this.topicId,
            name = this.name,
            encode_name = encodeURIComponent(this.name);
        var options = {},
            params = url.parse(util.format(format, encode_name, encode_name, page, step, topicId));
        options['host'] = params['host'];
        options['path'] = params['path'];
        options['headers'] = this.getHeaders(topicId);
        request.get(options, function(content){
            var data = reg.filter('weibo-item', content);
            callback(null, data);
        });        
    },
    getHeaders: function(topicId){
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': util.format('http://huati.weibo.com/%s?filter=mining', topicId),
            'Cookie': 'SINAGLOBAL=7925215171145.914.1393672251265; ULV=1393672427682:2:2:2:1637999788377.6477.1393672427623:1393672251314; __utma=3067689.1619589157.1393672252.1393672252.1393672252.1; __utmb=3067689.1.10.1393672252; __utmz=3067689.1393672252.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); HT=usr14167; _s_tentry=-; Apache=1637999788377.6477.1393672427623',    
            'Connection': 'keep-alive'
        };
    },
    getExponentIndex: function(callback, begin, end){
        var topicId = this.topicId,
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
            callback({ topicId: topicId, name: name }, result);
        });        
    },
    getTimeIndex: function(callback, date){
        var topicId = this.topicId,
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
            callback({ topicId: topicId, name: name }, result);
        });        
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

Topic.create = function(callback, name, topicId){
    async.parallel({
        topicId: function(cb){
            getTopicId(cb, name);
        },
        wordId: function(cb){
            getWordId(cb, name);
        }
    },
    function(err, results){
        var topicId = results['topicId'],
            wordId = results['wordId'];

        var topic = new Topic(name);
        topic.topicId = topicId || 0;
        topic.wordId = wordId || 0;

        callback(topic);
    });
};

module.exports = Topic;