var path = require('path');
var moment = require('moment');

var logger = require('./logger.js');
var Config = require('./config.js');
var Baidu = require('./baidu.js');
var BaiduStorage = require('./baidu-storage.js');

function BaiduDirector(){
    this.date = moment().format('YYYY-MM-DD-HH');
    this.config = new Config();
    this.storage = new BaiduStorage(this.date);
    this.report = path.normalize(path.resolve(__dirname, '..', 'report', 'baidu'));
}
BaiduDirector.prototype = {
    fetch: function(word){
        var that = this;
        var date = this.date;

        Baidu.create(function(baidu){
            //that.storage.saveSocialIndex.bind(that.storage)
            baidu.getSocialIndex(function(data){
                logger.trace(data);
            });
        }, word);
    },
    run: function(configfile){
        var that = this;
        that.storage.createSocialFile();
        that.config.read(configfile, function(data){
            for (var i = 0; i < data.length; i++) {
                that.fetch(data[i]);
            };
        });
    }
};

module.exports = BaiduDirector;