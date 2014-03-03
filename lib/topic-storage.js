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
        var filename = path.join(this.dir, this.date, topic.name, 'weigth.json');
        this.save(filename, data);
    },
    saveHotList: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'hot.html');
        this.save(filename, data);
    },
    saveLatestList: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'latest.json');
        this.save(filename, data);
    },
    saveExponentIndex: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'exponent.json');
        this.save(filename, data);
    },
    saveTimeIndex: function(topic, data){
        var filename = path.join(this.dir, this.date, topic.name, 'time.json');
        this.save(filename, data);
    },
    save: function(filename, data){
        var dir = path.dirname(filename);
        async.series({
            mkdir: function(callback){
                mkdirp(dir, function(err){ callback(err, dir); });
            },
            writeFile: function(callback){
                var content = JSON.stringify(data);
                var options = {
                    'encoding': 'utf-8',
                    'flag': 'w'
                };
                fs.writeFile(filename, content, function(err){ callback(err, dir); });
            }
        },
        function(err, results) {
            console.log(filename);
        });
    }
};

module.exports = TopicStorage;