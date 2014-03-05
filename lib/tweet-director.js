var fs = require('fs');
var path = require('path');
var async = require('async');
var moment = require('moment');

var logger = require('./logger.js');
var Config = require('./config.js');
var Tweet = require('./tweet.js');
var TweetStorage = require('./tweet-storage.js');

function TweetDirector(){
    this.date = moment().format('YYYY-MM-DD-HH');
    this.config = new Config();
    this.storage = new TweetStorage(this.date);
    this.report = path.normalize(path.resolve(__dirname, '..', 'report', 'twitter'));
}
TweetDirector.prototype = {
    fetch: function(word){
        var that = this;
        that.storage.createTweetStatistic(word);

        Tweet.create(function(tweet){
            var word_statistic = { 
                'word': word, 'interval': '',
                'min-timestamp': '', 'min-time-desc': '',
                'max-timestamp': '', 'max-time-desc': '',
                'retweet': 0, 'favorite': 0
            };
            var tweet_statistic = {};

            function createStatsFetch(id){
                return function(callback){
                    tweet.getStats(id, function(id, stats){
                        var retweet = stats['retweet']*1 || 0, 
                            favorite = stats['favorite']*1 || 0;
                        tweet_statistic[id]['retweet'] = retweet;
                        tweet_statistic[id]['favorite'] = favorite;
                        word_statistic['retweet'] += retweet;
                        word_statistic['favorite'] += favorite;
                        that.storage.saveTweetStatistic(word, tweet_statistic[id]);
                        callback(null, tweet_statistic);
                    });
                };
            }
            tweet.getTweetList(function(word, data){
                var tasks = [];
                for (var i = 0; i < data.length; i++) {
                    var id = data[i]['tweet-id'];
                    tweet_statistic[id] = data[i];
                    tasks.push(createStatsFetch(id));
                };
                async.parallel(tasks, function(err, results){
                    var filename = that.storage.getWordStatisticFilename();
                    that.storage.saveWordStatistic(word_statistic);
                });
            });
        }, word);
    },
    run: function(configfile){
        var that = this;
        that.storage.createWordStatisticFile();
        that.config.read(configfile, function(data){
            for (var i = 0; i < data.length; i++) {
                that.fetch(data[i]);
            };
        });
    }
};

module.exports = TweetDirector;