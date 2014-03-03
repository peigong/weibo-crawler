
var path = require('path');
var TopticDirector = require('./lib/toptic-director.js');

var filename = path.normalize(path.resolve(__dirname, 'config', 'keywords.conf'));
var director = new TopticDirector();
director.run(filename);
