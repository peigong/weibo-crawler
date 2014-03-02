var http = require('http');

function get(options, callback){
    http.get(options, function(res) {
        var buffers = [];
        res.on('data', function(data) {
            buffers.push(data);
        }).on('end', function(){
            var buffer = Buffer.concat(buffers);
            callback(buffer.toString());
        });
    }).on('error', function(e) {
        console.log("please again!");
    });
}

function headers(options, callback){
    http.get(options, function(res) {
        if (res.headers) {
            callback(res.headers);
        };
    });
}

module.exports = {
    get: get,
    headers: headers
};
