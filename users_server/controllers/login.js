const passport = require('../lib/passport/passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(ctx, next) {
	await passport.authenticate('local', async (err, user, info) => {
		if (err) throw err;
		if (!user) {
			ctx.status = info.status;
			ctx.body = {error: info.message};
			return;
		}
		if (user.verefyEmailToken) {
			ctx.status = 403;
			ctx.body - {error: "You need to verify email"}
			return
		}
		const token = await jwt.sign({email: user.email}, 'SECRET', {
			algorithm: "HS512"
		});
		await User.findByIdAndUpdate(user.id, {sessionToken: token}, {
			omitUnderfined: true,
			new: true,
		})
		ctx.body = {token};
	})(ctx, next);
}