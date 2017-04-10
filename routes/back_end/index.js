/**
 * Created by Mahao on 2017/4/7.
 */
import controller from '../tools/controllers'
import multer from 'koa-multer';
// const multer = require('koa-multer');
const upload = multer({ dest: 'uploads/' });
const koaBody = require('koa-body')({multipart: true});
export default class extends controller {
    renders() {

        // 登录
        this.router.get('/admin/login', async(ctx, next) => {

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/login')
        });

        // 后台管理-首页
        this.router.get('/admin/index', async(ctx, next) => {
            let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 12, // 每页显示数量
                showAll: true
            }; // 数据库查询参数


            ctx.state = {}; // 返回的数据初始化
            let totalHonor = await this.DBModule.Honor.findTotalHonor({}); // 获取荣誉资质总条数
            let total = totalHonor.count; // 荣誉资质总条数
            let result = await this.DBModule.Honor.findHonorList(queryParams); // 当前查询条件下的荣誉资质
            let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
            let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
            let responseData = {
                pageNum: queryParams.pageNum,
                pageSize: queryParams.pageSize,
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                total: total,
                honorData: result.data,
                requestUrl: '../admin/index?page='
            };
            ctx.state = responseData;
            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_index')
        });
    }

    actions() {

        // 登录验证
        this.router.post('/admin/login', async(ctx, next) => {
            let userName = ctx.request.body.userName;
            let userPassw = ctx.request.body.pwd;
            if (userName === 'admin' && userPassw === 'cqyir') {
                ctx.session.user = 'admin'; // 保留至session中
                ctx.body = {
                    "code": 0,
                    "msg": "账号验证成功"
                }
            } else {
                ctx.body = {
                    "code": 200,
                    "msg": "账号或密码错误"
                }
            }
        });

        // index-修改状态
        this.router.post('/honor/status', async(ctx, next) => {
            let honorId = ctx.request.body.id;
            let status = ctx.request.body.status == 'false'? false: true;
            let changeHonrStatus = await this.DBModule.Honor.changeHonrStatus({_id: honorId, hidden: status}); // 获取荣誉资质总条数
            if (changeHonrStatus.status) {
                ctx.body = {
                    "code": 0,
                    "msg": changeHonrStatus.msg
                };
            } else {
                ctx.body = {
                    "code": 200,
                    "msg": changeHonrStatus.msg
                };
            }
        });

        // index-删除特定的荣誉资质
        this.router.post('/honor/delete', async(ctx, next) => {
            let honorId = ctx.request.body.id;
            let deleteHonor = await this.DBModule.Honor.deleteHonrStatus({_id: honorId}); // 获取荣誉资质总条数
            if (deleteHonor.status) {
                ctx.body = {
                    "code": 0,
                    "msg": deleteHonor.msg
                };
            } else {
                ctx.body = {
                    "code": 200,
                    "msg": deleteHonor.msg
                };
            }
        });

        // index-荣誉资质图片上传
        this.router.post('/upload/honor',upload.single('file'), async (ctx, next) => {
            var requestBody = ctx.req.file;

            // console.log(ctx.request);
            console.log(requestBody);
            if (this._.isEmpty(requestBody)) {
                ctx.body = { code: 500, msg: "上传失败" };
                return false;
            }
            let reNameResult = await this.api.renameFiles([requestBody], "front_end/about/honor/");
            var resultsPath = reNameResult.resultsPath;
            if (reNameResult.status) {
                // var updateResult = await this.DBModule.Activity.updateActivityProgramImg(resultsPath, activityId);
                ctx.body = { code: 0, imgPath: resultsPath };
            } else {
                ctx.body = { code: 500, msg: '保存失败' };
            }
        });

        // index-荣誉资质图片上传
        this.router.post('/honor/add', async (ctx, next) => {
            console.log(ctx.request.body);
            var requestBody = ctx.request.body;
            if (requestBody) {
                var honorInfo = {
                    name: requestBody.name, // 图片名称
                    imgUrl: '../images/' + requestBody.imgUrl, // 荣誉资质图片地址
                    Summary: requestBody.imgDes // 图片概述
                };
                let result = await this.DBModule.Honor.saveHonor(honorInfo);
                if(result.status) {
                    ctx.body = { code: 0, msg: result.msg };
                } else {
                    ctx.body = { code: 500, msg: result.msg };
                }
            } else {
                ctx.body = { code: 500, msg: '参数错误' };
            }
        });
    }
}
