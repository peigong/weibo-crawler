var fs = require('fs');
var path = require('path');
var async = require('async');
var moment = require('moment');

var logger = require('./logger.js');
var Config = require('./config.js');
var Tweet = require('./tweet.js');
var TweetStorage = require('./tweet-storage.js');

function TweetDirector(){
    this.word_statistic = {};
    this.tweet_statistic = {}
    this.config = new Config();
    this.date = moment().format('YYYY-MM-DD-HH');
    this.storage = new TweetStorage(this.date);
    this.report = path.normalize(path.resolve(__dirname, '..', 'report', 'twitter'));
}
TweetDirector.prototype = {
    /**
    * 创建获取推文详细数据的回调函数的方法。
    * @param {Tweet} tweet 用于抓取数据的Tweet对象实例。
    * @param {String} word 抓取数据的关键词。
    * @param {Object} data 推文的基本数据。
    * @param {Object} word_statistic 关键词的数据统计对象。
    * @param {Object} tweet_statistic 推文的数据统计对象。
    */
    createTweetTask: function(tweet, word, data, tweet_statistic){
        var that = this;
        var id = data['tweet-id'];
        var name = data['screen-name'];
        return function(callback){
            async.parallel({
                'stats': function(cb){
                    tweet.getStats(id, function(id, stats){
                        cb(null, stats);
                    });
                },
                'profile': function(cb){
                    tweet.getProfile(name, function(screenname, profile){
                        cb(null, profile);
                    });
                }
            }, function(err, results){
                var stats = results['stats'] || {};
                var retweet = 0, favorite = 0;
                if (stats.hasOwnProperty('retweet')) {
                    retweet = stats['retweet'] * 1;
                }
                if (stats.hasOwnProperty('favorite')) {
                    favorite = stats['favorite'] * 1;
                }
                var profile = results['profile'] || {};
                var location = '';
                if (profile.hasOwnProperty('location')) {
                    location = profile['location'];
                }

                var entity = tweet_statistic[id];
                entity['retweet'] = retweet;
                entity['favorite'] = favorite;
                entity['location'] = location;
                that.storage.saveTweetStatistic(word, entity);
                tweet_statistic[id] = entity;

                that.word_statistic[word]['retweet'] += retweet;
                that.word_statistic[word]['favorite'] += favorite;
                callback(null, tweet_statistic[id]);
            });
        };
    },

    /**
    * 分析tweet数据的模板方法。
    * @param {Function} strategy 获取推文列表的策略方法。
    */
    template: function(word, strategy){
        var that = this;
        that.storage.createTweetStatistic(word);
        Tweet.create(function(tweet){
            that.word_statistic[word] = { 
                'word': word, 'interval': '',
                'min-timestamp': '', 'min-time-desc': '',
                'max-timestamp': '', 'max-time-desc': '',
                'retweet': 0, 'favorite': 0
            };
            that.tweet_statistic = {};
            strategy(tweet, word, that.tweet_statistic);
        }, word);
    },

    /**
    * 直接从检索首页获取推文的策略（只能获取40-50条）。
    * @param {Tweet} tweet 用于抓取数据的Tweet对象实例。
    * @param {String} word 抓取数据的关键词。
    * @param {Object} word_statistic 关键词的数据统计对象。
    * @param {Object} tweet_statistic 推文的数据统计对象。
    */
    defaultStrategy: function(tweet, word, tweet_statistic){
        var that = this;
        tweet.getTweetList(function(word, data){
            var tasks = [];
            for (var i = 0; i < data.length; i++) {
                var id = data[i]['tweet-id'];
                tweet_statistic[id] = data[i];
                var task = that.createTweetTask(tweet, word, data[i], tweet_statistic);
                tasks.push(task);
            };
            async.parallel(tasks, function(err, results){
                that.storage.saveWordStatistic(that.word_statistic[word]);
            });
        });
    },

    createTimelineTask: function(tweet, tweet_statistic){
        var that = this;
        return function(from, to, callback){
            if (from && !to) {
                callback = from;
                from = to = null;
            }
            tweet.getTimeLine(from, to, function(word, data, next_from, next_to){
                var tasks = [];
                for (var i = 0; i < data.length; i++) {
                    var id = data[i]['tweet-id'];
                    tweet_statistic[id] = data[i];
                    var task = that.createTweetTask(tweet, word, data[i], tweet_statistic)
                    tasks.push(task);
                };
                async.parallel(tasks, function(err, results){
                    callback(null, next_from, next_to);
                });
            });
        };
    },

    /**
    * 从时间轴获取推文的策略（一次可获取20条，可以循环获取）。
    * @param {Tweet} tweet 用于抓取数据的Tweet对象实例。
    * @param {String} word 抓取数据的关键词。
    * @param {Object} word_statistic 关键词的数据统计对象。
    * @param {Object} tweet_statistic 推文的数据统计对象。
    */
    timelineStrategy: function(tweet, word, tweet_statistic){
        var that = this;
        var top = 300, step = 20;
        var count = Math.ceil(top / step);
        var tasks = [];
        for (var i = 0; i < count; i++) {
            tasks.push(that.createTimelineTask(tweet, tweet_statistic));
        };
        async.waterfall(tasks, function (err, result) {
            that.storage.saveWordStatistic(that.word_statistic[word]);
        });
    },
    fetch: function(word){
        var that = this;
        that.template(word, that.defaultStrategy.bind(that));
    },
    retrospect: function(word){
        var that = this;
        that.template(word, that.timelineStrategy.bind(that));
    },
    run: function(configfile){
        var that = this;
        that.storage.createWordStatisticFile();
        that.config.read(configfile, function(data){
            for (var i = 0; i < data.length; i++) {
                //that.fetch(data[i]);
                that.retrospect(data[i]);
            };
        });
    }
};

module.exports = TweetDirector;