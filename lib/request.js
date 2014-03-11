var http = require('http');
var https = require('https');
var iconv = require('iconv-lite');

var logger = require('./logger.js');

function defaultErrorHandler(err){
    logger.error(err);
}
function createCallback(encoding, callback){
    return function(res){
        var buffers = [];
        res.on('data', function(data) {
            buffers.push(data);
        }).on('end', function(){
            var buffer = Buffer.concat(buffers);
            callback(iconv.decode(buffer, encoding));
        });
    }
}
function get(options, callback, errorHandler){
    errorHandler = errorHandler || defaultErrorHandler;
    encoding = 'utf-8';
    http.get(options, createCallback(encoding, callback)).on('error', errorHandler);
}
function getGBK(options, callback, errorHandler){
    errorHandler = errorHandler || defaultErrorHandler;
    encoding = 'gbk';
    http.get(options, createCallback(encoding, callback)).on('error', errorHandler);
}
function sget(options, callback, errorHandler){
    errorHandler = errorHandler || defaultErrorHandler;
    encoding = 'utf-8';
    https.get(options, createCallback(encoding, callback)).on('error', errorHandler);
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
    getGBK: getGBK,
    sget: sget,
    headers: headers
};
