
var nopt = require("nopt");
var TopicDirector = require('./lib/topic-director.js');
var TweetDirector = require('./lib/tweet-director.js');

var knownOpts = { "type" : [String, null], "word" : [String, null] }
  , shortHands = { "t" : ["--type"], "w" : ["--word"] }
  , params = nopt(knownOpts, shortHands, process.argv, 2);

function printUsage(){
    console.log('Usage:node run -t sina|twitter');
}

var type = params.type;
var word = params.word;
if(type && word){
    switch(type){
        case 'sina':
            director = new TopicDirector();
            director.fetch(word);
            break;
        case 'twitter':
            director = new TweetDirector();
            director.fetch(word);
            break;
        default:
            printUsage();
    }
}else{
    printUsage();
}

