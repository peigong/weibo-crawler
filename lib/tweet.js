var util = require('util');

var logger = require('./logger.js');
var reg = require('./reg.js');
var request = require('./request.js');

var service = {
    'search': 'https://twitter.com/search?q=%s&src=typd',
    'timeline': 'https://twitter.com/i/search/timeline?q=%s&src=tren&include_available_features=1&include_entities=1&last_note_ts=0&scroll_cursor=TWEET-%s-%s',
    'batch': 'https://twitter.com/i/expanded/batch/%s?facepile_max=7&include%5B%5D=social_proof&include%5B%5D=ancestors&include%5B%5D=descendants&page_context=search&section_context=universal_top',
    'profile': 'https://twitter.com/%s'
};

function Tweet(query){
    this.query = query;
}
Tweet.prototype = {
    getTweetList: function(callback){
        var that = this;
        var query = that.query,
            options = util.format(service.search, encodeURIComponent(query));
        
        request.sget(options, function(content){
            var data = reg.filter('tweet-list', content);
            callback(that.query, data);
        });        
    },
    getTimeLine: function(from, to, callback){
        var that = this;
        var query = that.query,
            options = util.format(service.timeline, encodeURIComponent(query), from, to);
        
        request.sget(options, function(content){
            var data = reg.filter('tweet-timeline', content);
            callback(that.query, data);
        });        
    },
    getStats: function(id, callback){
        var that = this;
        var options = util.format(service.batch, id);
        
        request.sget(options, function(content){
            var data = reg.filter('tweet-batch', content);
            callback(id, data);
        });        
    },
    getProfile: function(screenname, callback){
        var that = this;
        var options = util.format(service.profile, screenname);
        
        request.sget(options, function(content){
            var data = reg.filter('twitter-profile', content);
            callback(screenname, data);
        });        
    }

};
Tweet.create = function(callback, query){
    callback(new Tweet(query));
}

module.exports = Tweet;