var http = require('http');
var https = require('https');
var logger = require('./logger.js');

function defaultErrorHandler(err){
    logger.error(err);
}

function createCallback(callback){
    return function(res){
        var buffers = [];
        res.on('data', function(data) {
            buffers.push(data);
        }).on('end', function(){
            var buffer = Buffer.concat(buffers);
            callback(buffer.toString());
        });
    }
}

function get(options, callback, errorHandler){
    errorHandler = errorHandler || defaultErrorHandler;
    http.get(options, createCallback(callback)).on('error', errorHandler);
}
function sget(options, callback, errorHandler){
    errorHandler = errorHandler || defaultErrorHandler;
    https.get(options, createCallback(callback)).on('error', errorHandler);
}

function headers(options, callback){
    http.get(options, function(res) {
        if (res.headers) {
            callback(res.headers);
        };
    });
}

module.exports = {
    get: get,
    sget: sget,
    headers: headers
};
