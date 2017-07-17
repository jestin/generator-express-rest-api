var mongoose = require('mongoose');

var schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: String
});

module.exports = function() {
	return mongoose.model('<%= modelClassName %>', schema);
};
