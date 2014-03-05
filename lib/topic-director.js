var path = require('path');
var moment = require('moment');

var logger = require('./logger.js');
var Config = require('./config.js');
var Topic = require('./topic.js');
var TopicStorage = require('./topic-storage.js');

function TopticDirector(){
    this.date = moment().format('YYYY-MM-DD-HH');
    this.config = new Config();
    this.storage = new TopicStorage(this.date);
    this.report = path.normalize(path.resolve(__dirname, '..', 'report', 'sina'));
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
    run: function(configfile){
        var that = this;
        that.storage.createWeightFile();
        that.config.read(configfile, function(data){
            for (var i = 0; i < data.length; i++) {
                that.fetch(data[i]);
            };
        });
    }
};

module.exports = TopticDirector;