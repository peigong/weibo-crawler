var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var iconv = require('iconv-lite');

var logger = require('./logger.js');
var Storage = require('./storage.js');

function TopicStorage(date){
    this.date = date;
    this.storage = new Storage();
    this.dir = path.normalize(path.resolve(__dirname, '..', 'report', 'sina'));
}
TopicStorage.prototype = {
    getWeigthFilename: function(){
        return path.join(this.dir, this.date) + '.csv';
    },
    createWeightFile: function(){
        var filename = this.getWeigthFilename();
        var data = '关键词,点赞,近一周关注度,24小时关注度\n';
        this.storage.save(filename, data);
    },
    saveWeigth: function(topic, data){
        var filename = this.getWeigthFilename();
        data = [topic.name, data.good || 0, data.week || 0, data.day || 0].join(',') + '\n';
        this.storage.append(filename, data);
    },
    saveHotList: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'hot.json');
        data = JSON.stringify(data);
        this.storage.save(filename, data);
    },
    saveLatestList: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'latest.json');
        data = JSON.stringify(data);
        this.storage.save(filename, data);
    },
    saveExponentIndex: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'exponent.json');
        data = JSON.stringify(data);
        this.storage.save(filename, data);
    },
    saveTimeIndex: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'time.json');
        data = JSON.stringify(data);
        this.storage.save(filename, data);
    }
};

module.exports = TopicStorage;