const mongoose = require('mongoose');
const connection = require('../lib/connection');
const Skill = require("./Skill");
const crypto = require('crypto');
const { config } = require('process');

const schema = new mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [
			{
				validator: value => {
					return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
				},
				message: "Incorrect email"
			}
		]
	},
	passwordHash: {
		type: String
	},
	salt: {
		type: String
	},
	sessionToken: {
		type: String
	},
	verefyEmailToken: {
		type: String
	},
	//or example in Skill and remove this key (skills)
	skills: [{
		type: mongoose.Types.ObjectId,
		ref: Skill.modelName
	}]
}, {
	timestamps: true
});


function generatePassword(salt, password) {
	return new Promise((res, rej) => {
		crypto.pbkdf2(
			password, salt,
			// config.crypto.iterations,
			// config.crypto.length,
			// config.crypto.digest,
			1,
			10,
			"sha512",
			(err, key) => {
				if (err) return rej(err);
				res(key.toString('hex'));
			}
		)
	})
}


function generateSalt() {
	return new Promise((res, rej) => {
		crypto.randomBytes(
			// config.crypto.length,
			10,
			 (err, buf) => {
			if (err) return rej(err);
			res(buf.toString('hex'));
		})
	})
}

schema.methods.setPassword = async function(password) {
	this.salt = await generateSalt();
	this.passwordHash = await generatePassword(this.salt, password);
}

schema.methods.checkPassword = async function(password) {
	if (!password) return false;
	if (!this.salt) return false;
	if (!this.passwordHash) return false;
	const hash = await generatePassword(this.salt, password);
	return this.passwordHash === hash;
}

// And add this
// schema.virtual('skills', {
// 	ref: Skill.modelName,
// 	localField: '_id',
// 	foreignField: 'user'
// })
module.exports =  connection.model('User', schema);