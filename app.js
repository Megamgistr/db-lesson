const App = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');


const app = new App();
const router = new Router();
app.use(bodyparser())
	.use(router.routes())
	.use(router.allowedMethods());

router.use('/', (ctx, next) => {
	ctx.body = 'Hello';
})

app.listen(3000);