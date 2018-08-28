var rp = require('request-promise');
var env = require('node-env-file');
env(__dirname + '/.env');
var logger = require('./logger.js');

var obj = {};
obj.getCSV = function(){
	return rp(process.env.URL);
}

module.exports = obj;