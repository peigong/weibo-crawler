
var nopt = require("nopt");
var path = require('path');
var util = require('util');

//var logger = require('./lib/logger.js');
var TopicDirector = require('./lib/topic-director.js');
var TweetDirector = require('./lib/tweet-director.js');
var BaiduDirector = require('./lib/baidu-director.js');

var directors = {
    'sina': TopicDirector,
    'twitter': TweetDirector,
    'baidu': BaiduDirector
};

var knownOpts = { "type" : [String, null], "config" : [String, null] }
  , shortHands = { "t" : ["--type"], "c" : ["--config"] }
  , params = nopt(knownOpts, shortHands, process.argv, 2);

var type = params.type.toLowerCase();
var config = params.config;

var conf = util.format('%s-keywords.conf', type);
if (config) {
    conf = config;
};
var conf_file = path.normalize(path.resolve(__dirname, 'config', conf));

switch(type){
    case 'sina':
    case 'twitter':
    case 'baidu':
        var director = new directors[type]();
        break;
    default:
}

if (director) {
    director.run(conf_file);
}else{
    console.log('Usage:node run -t sina|twitter|baidu [-c type-keywords.conf]');
}
