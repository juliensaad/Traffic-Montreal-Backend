var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BridgeSchema   = new Schema({
	bridgeName: String,
	direction: String,
	start: String,
	end: String,
	time: String,
	realTime: String,
	percentage: String,
	delay: String,
	cond: String,
	shore: String,
	lastUpdate: String
});

module.exports = mongoose.model('Bridge', BridgeSchema);