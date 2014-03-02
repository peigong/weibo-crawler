
var nopt = require("nopt")
  , knownOpts = { "word" : [String, null] }
  , shortHands = { "w" : ["--word"] }
  , params = nopt(knownOpts, shortHands, process.argv, 2);

var word = params.word;
if(word){
}else{
    console.log('Usage:node fetch -w word');
}

