
var nopt = require("nopt");
var TopticDirector = require('./lib/toptic-director.js');

var knownOpts = { "word" : [String, null] }
  , shortHands = { "w" : ["--word"] }
  , params = nopt(knownOpts, shortHands, process.argv, 2);

var word = params.word;
if(word){
    var director = new TopticDirector();
    director.fetch(word);
}else{
    console.log('Usage:node fetch -w word');
}

