var fs = require('fs');
var path = require('path');
var async = require('async');
var moment = require('moment');
var Topic = require('./topic.js');
var TopicStorage = require('./topic-storage.js');

function TopticDirector(){
    this.date = moment().format('YYYY-MM-DD-HH');
    this.storage = new TopicStorage(this.date);
    this.report = path.normalize(path.resolve(__dirname, '..', 'report'));
}
TopticDirector.prototype = {
    fetch: function(word){
        var that = this;
        var date = this.date;
        var begin = moment().add('days', -30).format('YYYY-MM-DD');
        var end = date;

        Topic.create(function(topic){
            //topic.topN = 20;
            topic.getWeigth(that.storage.saveWeigth.bind(that.storage));
            /*topic.getHotList(that.storage.saveHotList.bind(that.storage));
            topic.getLatestList(that.storage.saveLatestList.bind(that.storage));
            topic.getExponentIndex(that.storage.saveExponentIndex.bind(that.storage), begin, end);
            topic.getTimeIndex(that.storage.saveTimeIndex.bind(that.storage), date);*/
        }, word);
    },
    run: function(keywords){
        var that = this;
        async.parallel({
            /*读关键词配置数据*/
            'keywords': function(callback){
                fs.readFile(keywords, function (err, data) {
                    callback(err, data.toString());
                });
            },
            /*创建报告文件*/
            'report': function(callback){
                var filename = path.join(that.report, that.date) + '.csv';
                var data = '关键词,点赞,近一周关注度,24小时关注度\n';
                that.storage.save(filename, data);
                callback(null, data);
            }
        }, function(err, results){
            var dict = {};
            var lines = results['keywords'].split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                line = line.replace(/\s+/g, '');
                line = line.replace(/[\r\n]/g,'');
                //line = line.replace('\n', '');
                //line = line.replace('\r', '');
                var arr = lines[i].split(':');
                if (2 == arr.length) {
                    var words = arr[1].split(',');
                    for (var j = 0; j < words.length; j++) {
                        var word = words[j];
                        if (dict.hasOwnProperty(word)) {
                            dict[word]++;
                        }else{
                            dict[word] = 1;
                        }
                    };
                };
            };
            for(var key in dict){
                that.fetch(key);
            }
        });
    }
};

module.exports = TopticDirector;