const mongoose = require('mongoose');

mongoose.set('debug', true)

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
	}
});

const User = mongoose.model('User', schema);

async function main() {
	mongoose.connect("mongourl");
	await User.deleteMany();

	const user = await User.create({
		name: "Nikita",
		email: "test@test.ru"
	});

	const users = await User.find();

	console.log(users);

	mongoose.disconnect();
}

main();