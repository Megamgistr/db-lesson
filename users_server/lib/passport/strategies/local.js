const localStrategy = require('passport-local').Strategy;
const User = require('../../../models/User');

module.exports = new localStrategy({
	usernameField: 'email',
	session: false
}, async function(email, password, done) {
	const user = await User.findOne({email});
	if (user) {
		const isValid = await user.checkPassword(password);
		if (isValid) {
			return done(null, user)
		}
	}
	return done(null, false, {status: 400, message: ""})
})