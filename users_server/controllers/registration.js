const sendEmail = require('../lib/emailService');
const User = require('../models/User');
const mapUser = require('../utils/mappers/mapUser');
const jsonwebtoken = require('jsonwebtoken');

module.exports = async function(ctx) {
	const verefyEmailToken = await jsonwebtoken.sign({email: ctx.request.body.email}, "EMAIL");
	ctx.request.body.verefyEmailToken = verefyEmailToken;
	const user = await User.create(ctx.request.body);
	await user.setPassword(ctx.request.body.password)
	await user.save();
	const link = `http://localhost:3000/users/verefy/${verefyEmailToken}`;
	sendEmail({
		template: "mail",
		locals: {
			name: user.name,
			link: link
		},
		to: user.email,
		subject: `Hello ${user.name}, please verefy your email`
	})
	ctx.body = {user: mapUser(user), link};
}