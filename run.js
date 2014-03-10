
var nopt = require("nopt");
var path = require('path');

//var logger = require('./lib/logger.js');
var TopicDirector = require('./lib/topic-director.js');
var TweetDirector = require('./lib/tweet-director.js');
var BaiduDirector = require('./lib/baidu-director.js');

var knownOpts = { "type" : [String, null] }
  , shortHands = { "t" : ["--type"] }
  , params = nopt(knownOpts, shortHands, process.argv, 2);

var type = params.type;
var filename, director;
switch(type){
    case 'sina':
        filename = path.normalize(path.resolve(__dirname, 'config', 'sina-keywords.conf'));
        director = new TopicDirector();
        director.run(filename);
        break;
    case 'twitter':
        filename = path.normalize(path.resolve(__dirname, 'config', 'twitter-keywords.conf'));
        director = new TweetDirector();
        director.run(filename);
        break;
    case 'baidu':
        filename = path.normalize(path.resolve(__dirname, 'config', 'baidu-keywords.conf'));
        director = new BaiduDirector();
        director.run(filename);
        break;
    default:
        console.log('Usage:node run -t sina|twitter|baidu');
}

