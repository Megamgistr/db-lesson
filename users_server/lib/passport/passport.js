const {KoaPassport} = require('koa-passport');
const pasport = new KoaPassport();

const localStrategy = require('./strategies/local');
// const vkontakteStrategy = require('./strategies/vk');
// const githubStrategy = require('./strategies/github');


pasport.use(localStrategy);
// pasport.use(vkontakteStrategy);
// pasport.use(githubStrategy);

module.exports = pasport;
