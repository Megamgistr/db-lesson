const mongoose = require('mongoose');
const connection = require('../lib/connection');

const schema = new mongoose.Schema({
	label: {
		type: String
	},
	// And add this
	// user: [{
	// 	type: mongoose.Types.ObjectId,
	// 	ref: 'User'
	// }]
});

module.exports =  connection.model('Skill', schema);