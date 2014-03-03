/**
* 代码来源：https://github.com/zxlie/FeHelper
* https://github.com/zxlie/FeHelper/blob/master/chrome/static/js/endecode/endecode-lib.js
*/

/**
 * 此方法用于将Unicode码解码为正常字符串
 * @param {Object} text
 */
var _uniDecode = function(text){
    text = text.replace(/\\/g, "%").replace('%u0025', '%25');
    
    text = unescape(text.toString().replace(/%2B/g, "+"));
    var matches = text.match(/(%u00([0-9A-F]{2}))/gi);
    if (matches) {
        for (var matchid = 0; matchid < matches.length; matchid++) {
            var code = matches[matchid].substring(1, 3);
            var x = Number("0x" + code);
            if (x >= 128) {
                text = text.replace(matches[matchid], code);
            }
        }
    }
    text = unescape(text.toString().replace(/%2B/g, "+"));
    
    return text;
};

module.exports = {
    uniDecode: _uniDecode,
};