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

// get error
app.use(async (ctx, next) => {
    try{

        // 登录了之后将用户信息统一放入每一个返回的页面 得在next前面, url 也返回到页面
        // if(ctx.request.method.toLowerCase() == 'get' && ctx.session.user){
        //     console.log('ctx.session.user : ',ctx.session.user);
        //     ctx.state['user'] = ctx.session.user;
        // }


        await next();

        // next 执行完后 请求状态发生改变，404 错误不会走catch，所以在try中处理404等错误 默认请求的状态是404
        if (ctx.status.toString().substr(0,1) == 4) {
            ctx.state = {
                errorCode: ctx.status + ' 请求资源未找到'
            };
            await ctx.render('error', {
            });
        }
    }
    catch (err){
        console.log('ctx.err : ', err);
        if (ctx.request.method.toLowerCase() == 'post') {
            ctx.body = {
                error: err,
                status: 'failed',
                errMsg: err.errMsg ? err.errMsg : 'server error'
            };
        }
        else{
            ctx.state = {
                errorCode: '服务器内部错误！'
            };
            await ctx.render('error', {
            });
        }
    }

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