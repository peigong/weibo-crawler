
var word = require('word'),
    config = require('./config/filter.js'),
    codeHelper = require('./helper/endecode.js');

/**
* @param {String} key 配置文件中，过滤器的Key。
*/
function filter(key, content){
    var result = [];
    var conf = config[key];
    while(res = conf.reg.exec(content)){
        var out = {};
        for(var key in conf.mapping){
            var val = res[conf.mapping[key]];
            if (val) {
                val = clean(val);
            }else{
                val = '';
            }
            out[key] = val;
        }
        result.push(out);
    }
    if (0 == result.length) {
        result = {};
    }else if(1 == result.length){
        result = result[0];
    }
    return result;
}

function clean(content){
    //content = content.replace(/(^\s*)|(\s*$)/g, '');
    content = word.stripSlashes(content);
    content = content.replace(/\\\//g, '/');
    content = content.replace(/<[^>].*?>/g,'');
    content = codeHelper.uniDecode(content);
    content = content.replace(/\s+/g, '');
    return content;
}

module.exports = {
    filter: filter,
    clean: clean
};