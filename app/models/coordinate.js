var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CoordinateSchema   = new Schema({
	name: String,
	direction: String,
	start: String,
	end: String
});

module.exports = mongoose.model('Coordinate',CoordinateSchema);