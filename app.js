const fs = require ('fs');
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const mongoose = require('mongoose'); // mongoose
require('dotenv').config(); // 加载环境变量
const MONGO_HOST = process.env.BLOG_MONGO_HOST || 'localhost';
const DBModule = new (require('./modules/modules.js'))(mongoose);
mongoose.connect(`mongodb://${MONGO_HOST}/cqyir`); // 数据库链接
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	process.env.NODE_ENV == 'development' && console.log("======> db connected")
});

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public')); // 静态资源目录

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// router
let fontRouters = fs.readdirSync('./routes/front_end');
fontRouters.forEach(name => {
	name!= 'tools' && (new (require(`./routes/front_end/${name}`))(router, DBModule, app)).init();
});
let backRouters = fs.readdirSync('./routes/back_end');
backRouters.forEach(name => {
	name!= 'tools' && (new (require(`./routes/back_end/${name}`))(router, DBModule, app)).init();
});

app.use(router.routes(), router.allowedMethods());

// error handler
app.on('error', (err, ctx) => {
  console.log(err);
  logger.error('server error', err, ctx);
});

module.exports = app;