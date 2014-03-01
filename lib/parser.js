var fs = require('fs');
var path = require('path');
var config = require('../config.js');

function extract(content, regList, regItem, config){
    var result = [];
    resList = regList.exec(content);
    if (resList) {
        content = resList[1];
        while(res = regItem.exec(content)){
            var out = {};
            for(var key in config){
                out[key] = res[config[key]];
            }
            result.push(out);
        }
    };
    return result;
}

function saveFile(key, content){
    var filename = path.join(__dirname, '..', 'report', key);
    fs.writeFile(filename, content, function(err){});        
}

module.exports = function(key, html){
    var reg = /\"pl_weibo_direct\".+html\":\"(.+)\"\}\)<\/script>/;   
    res = reg.exec(html)
    if (res) {
        var content = res[1];
        var result = {};
        for(var k in config){
            result[k] = extract(content, config[k].regList, config[k].regItem, config[k].config)
        }
        result = JSON.stringify(result);
    　　console.log(result);   
        key = decodeURIComponent(key);
        key = decodeURIComponent(key);
        saveFile([key, 'html'].join('.'), html);
        saveFile([key, 'json'].join('.'), result);
    };
}