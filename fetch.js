
var http = require('http');
var util = require('util');
var parser = require('./lib/parser.js');
var nopt = require("nopt")
  , knownOpts = { "key" : [String, null] }
  , shortHands = { "k" : ["--key"] }
  , params = nopt(knownOpts, shortHands, process.argv, 2);

var key = params.key;
if(key){
    key = encodeURIComponent(key);
    key = encodeURIComponent(key);
    var url = util.format("http://s.weibo.com/weibo/%s", key);
    http.get(url, function(res) {
        var buffers = [];
        res.on('data', function(data) {
            buffers.push(data);
        }).on('end', function(){
            var buffer = Buffer.concat(buffers);
            parser(key, buffer.toString());
        });
    }).on('error', function(e) {
      console.log("please again!");
    });
}else{
    console.log('Usage:node fetch -k key');
}

