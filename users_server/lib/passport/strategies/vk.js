const VKStrategy = require('passport-vkontakte').Strategy;
const authenticate = require('./authenticate');


module.exports = new VKStrategy({
	clientID: "id",
	clientSecret: "secret",
	callbackURL: "cbUrl",
	scope: "scope",
	session: false
}, async function(accessToken, refreshToken, params, profile, done) {
	authenticate('vk', params.email, profile.displayName, done);
})