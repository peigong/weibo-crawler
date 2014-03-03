var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');

function TopicStorage(date){
    this.date = date;
    this.dir = path.normalize(path.resolve(__dirname, '..', 'report'));
}
TopicStorage.prototype = {
    saveWeigth: function(topic, data){
        var filename = path.join(this.dir, this.date) + '.csv';
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
    append: function(filename, data){
        fs.appendFile(filename, data, function(err){
            console.log(data);
        });
    },
    save: function(filename, data){
        var dir = path.dirname(filename);
        async.series({
            mkdir: function(callback){
                mkdirp(dir, function(err){ callback(err, dir); });
            },
            writeFile: function(callback){
                fs.writeFile(filename, data, function(err){ callback(err, dir); });
            }
        },
        function(err, results) {
            console.log(data);
        });
    }
};

module.exports = TopicStorage;