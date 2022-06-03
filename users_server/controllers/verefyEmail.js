const User = require('../models/User');

module.exports = async function(ctx) {
	const id = ctx.params.id;
	if (!id) {
		ctx.status = 404;
		ctx.body = "Not found";
		return;
	}
	const user = await User.findOneAndUpdate({verefyEmailToken: id}, {verefyEmailToken: ""})
	if (!user) {
		ctx.status = 404;
		ctx.body = "User not found";
		return;
	}
	ctx.body = "Thanks for verefy";
}