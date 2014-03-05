var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var iconv = require('iconv-lite');

var logger = require('./logger.js');

function Storage() {
}
Storage.prototype = {
    getEncoding: function(filename){
        var coding = 'utf-8';
        var extname = path.extname(filename).toLowerCase();
        if ('.csv' == extname) {
            coding = 'gb2312';
        }
        return coding;
    },
    encodeData: function(coding, data){
        if ('gb2312' == coding) {
            data = iconv.encode(data, 'gbk');
        }
        return data;
    },
    pushData: function(filename, data){
        if(!Storage.AppendQueue.hasOwnProperty(filename)){
            Storage.AppendQueue[filename] = [];
        }
        Storage.AppendQueue[filename].push(data);
    },
    pullData: function(filename, data){
        if(Storage.AppendQueue.hasOwnProperty(filename)){
            Storage.AppendQueue[filename].push(data);
            data = Storage.AppendQueue[filename].join('');
        }
        return data;
    },
    append: function(filename, data){
        var that = this;
        var coding = that.getEncoding(filename);
        var options = { 'coding': coding };
        data = that.pullData(filename, data);
        logger.trace(data);
        var encoded_data = that.encodeData(coding, data.replace(/^$/g, ''));
        fs.appendFile(filename, encoded_data, options, function(err){
            if(err){ 
                that.pushData(data);
                logger.error(err); 
            }
        });
    },
    save: function(filename, data, callback){
        var that = this;
        callback = callback || function(err){};
        var dir = path.dirname(filename);
        mkdirp(dir, function(err){
            var coding = that.getEncoding(filename);
            var options = { 'coding': coding };
            logger.trace(data);
            data = that.encodeData(coding, data);
            fs.writeFile(filename, data, options, function(err){});
        });
    }
};
Storage.AppendQueue = {};

module.exports = Storage;