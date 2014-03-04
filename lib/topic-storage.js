var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var iconv = require('iconv-lite');

var logger = require('./logger.js');

function TopicStorage(date){
    this.date = date;
    this.dir = path.normalize(path.resolve(__dirname, '..', 'report'));
}
TopicStorage.prototype = {
    getWeigthFilename: function(){
        return path.join(this.dir, this.date) + '.csv';
    },
    createWeightFile: function(){
        var filename = this.getWeigthFilename();
        var data = '关键词,点赞,近一周关注度,24小时关注度\n';
        this.save(filename, data);
    },
    saveWeigth: function(topic, data){
        var filename = this.getWeigthFilename();
        data = [topic.name, data.good || 0, data.week || 0, data.day || 0].join(',') + '\n';
        this.append(filename, data);
    },
    saveHotList: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'hot.json');
        data = JSON.stringify(data);
        this.save(filename, data);
    },
    saveLatestList: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'latest.json');
        data = JSON.stringify(data);
        this.save(filename, data);
    },
    saveExponentIndex: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'exponent.json');
        data = JSON.stringify(data);
        this.save(filename, data);
    },
    saveTimeIndex: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'time.json');
        data = JSON.stringify(data);
        this.save(filename, data);
    },
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
    append: function(filename, data){
        var that = this;
        var coding = that.getEncoding(filename);
        var options = { 'coding': coding };
        logger.trace(data);
        data = that.encodeData(coding, data);
        fs.appendFile(filename, data, options, function(err){
            if(err){ logger.error(err); }
        });
    },
    save: function(filename, data){
        var that = this;
        var dir = path.dirname(filename);
        async.series({
            mkdir: function(callback){
                mkdirp(dir, callback);
            },
            writeFile: function(callback){
                var coding = that.getEncoding(filename);
                var options = { 'coding': coding };
                logger.trace(data);
                data = that.encodeData(coding, data);
                fs.writeFile(filename, data, options, callback);
            }
        },
        function(err, results) {
            if(err){ logger.error(err); }
        });
    }
};

module.exports = TopicStorage;