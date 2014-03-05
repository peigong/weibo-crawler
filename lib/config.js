var fs = require('fs');
var logger = require('./logger.js');

function Config(){
}

Config.prototype = {
    read: function(filename, callback){
        fs.readFile(filename, function (err, data) {
            var dict = {}, result = [];
            var lines = data.toString().split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                line = line.replace('\r', '');
                line = line.replace(/\s+/g, '');
                var arr = line.split(':');
                if (2 == arr.length) {
                    var words = arr[1].split(',');
                    for (var j = 0; j < words.length; j++) {
                        var word = words[j];
                        if (dict.hasOwnProperty(word)) {
                            dict[word]++;
                        }else{
                            dict[word] = 1;
                            result.push(word);
                        }
                    }
                }
            }
            callback(result);
        });
    }
};

module.exports = Config;