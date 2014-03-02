var moment = require('moment');
var Topic = require('./lib/topic.js');
var TopicStorage = require('./lib/topic-storage.js');

var date = moment().format('YYYY-MM-DD');
var begin = moment().add('days', -30).format('YYYY-MM-DD');
var end = date;

var storage = new TopicStorage(date);

Topic.create(function(topic){
    topic.getWeigth(storage.saveWeigth.bind(storage));
    topic.getHotList(storage.saveHotList.bind(storage));
    topic.getLatestList(storage.saveLatestList.bind(storage));
    topic.getExponentIndex(storage.saveExponentIndex.bind(storage), begin, end);
    topic.getTimeIndex(storage.saveTimeIndex.bind(storage), date);
}, '二月二龙抬头');
