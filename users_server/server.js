 const Koa = require('koa');
 const Router = require('koa-router');
 const mongoose = require('mongoose');
 const User = require('./models/User');
 const Skill = require('./models/Skill');
 const login = require('./controllers/login');
 const registration = require('./controllers/registration');
 const mapUser = require('./utils/mappers/mapUser');
 const mapSkill = require('./utils/mappers/mapSkill');
const verefyEmail = require('./controllers/verefyEmail');

 const app = new Koa();
 const router = new Router();

 app.use(require('koa-bodyparser')())
 .use(async (ctx, next) => {
	 try {
		 await next();
	 } catch(e) {
		 if (e.status) {
			ctx.status = e.status;
			ctx.body = {error: e.message};
		 } else {
		 ctx.status = 500;
		 ctx.body = "Internal server error";
		 }
		 console.error(e);
	 }
 })
 .use(router.routes())
 .use(router.allowedMethods());

 function validateUserId(ctx, next) {
	const id = ctx.params?.id;
	const isValid = mongoose.Types.ObjectId.isValid(id);
	if (!isValid) {
		ctx.throw(400, 'Incorrect user id');
	}
	return next();
 }

 async function handleValidationErrors(ctx, next) {
	 try {
		await next();
	 } catch (err) {
		 if (err.name !== 'MongoServerError') {
			 throw err;
		 }
		 ctx.status = 400;
		 ctx.body= {error: `${Object.keys(err.keyPattern).join(',')}: ${err.codeName}`};
	 }
 }

 async function checkSessionToken(ctx, next) {
	 const token = ctx.request.header?.authorization?.split(' ')[1];
	 console.log(token);
	 if (!token) {
		 ctx.throw(401, "Not authorization");
	 }
	 const user = await User.findOne({sessionToken: token});
	 console.log(user);
	 if (!user) {
		ctx.throw(401, "Not authorization");
	 }
	 await next();
 }

 router.post('/users/skill', async (ctx) => {
	const label = ctx.request.body?.label;
	const skill = await Skill.create({label})
	ctx.body = {skill: mapSkill(skill)};
});
 router.get('/users', checkSessionToken,  async (ctx) => {
	 const users = await User.find();
	 console.log(users);
	 ctx.body = {users: users.map(mapUser)};
 });
 router.get('/users/:id', checkSessionToken, validateUserId, async (ctx) => {
	 //User.findById(ctx.params.id).populet('skills')
	const user = await User.findById(ctx.params.id);
	if (!user) {
		ctx.throw(404, 'User not found');
	}
	ctx.body = {user: mapUser(user)};
 });
 router.delete('/users/:id', checkSessionToken, validateUserId, async (ctx) => {
	const user = await User.findByIdAndRemove(ctx.params.id);
	if (!user) {
		ctx.throw(404, 'User not found');
	}
	ctx.body = {user: mapUser(user)};
 });
 router.patch('/users/:id', checkSessionToken, handleValidationErrors, validateUserId, async (ctx) => {
	 //findByIdAndUpdate(id, {...}) - по умолчания валидация отключена
	 // findById() -> modify -> save()

	const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
		omitUnderfined: true,
		new: true,
		runValidators: true
	})

	if (!user) {
		ctx.throw(404, 'User not found');
	}
	ctx.body = {user: mapUser(user)};
 });
 router.post('/users/registration', handleValidationErrors, registration);

 router.post('/users/login', login)

 router.get('/users/verefy/:id', handleValidationErrors, verefyEmail)




 module.exports = app;