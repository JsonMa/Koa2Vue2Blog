/**
 * Created by Mahao on 2017/4/7.
 */
import controller from '../tools/controllers'
import multer from 'koa-multer';
const upload = multer({ dest: 'public/uploads/' });
// import fs from 'fs';
import path from 'path';

export default class extends controller {
    renders() {

        // 登录
        this.router.get('/admin/login', async(ctx, next) => {

            // 判断是否是debug
            var debug = ctx.request.query._d;
            ctx.state.requestUrl = ctx.query.from || '/admin/index';
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/login')
        });

        // 登录
        this.router.get('/admin/logout', async(ctx, next) => {

            ctx.session = null;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            ctx.state.requestUrl = ctx.query.from || '/admin/index';
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/login')
        });

        // 后台管理-首页
        this.router.get('/admin/index',this.api.isLogin(), async(ctx, next) => {
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
                nav: 'index',
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

        // honor 详情
        this.router.get('/admin/honor_detail',this.api.isLogin(), async(ctx, next) => {
            let honorId = ctx.request.query.id;
            let pageNum = ctx.request.query.page || 1;
            let honor = await this.DBModule.Honor.findHonor({_id: honorId}); // 获取荣誉资质总条数
            if (honor.status) {
                ctx.state.honorData = honor.data[0]; // 获取第一个元素
                ctx.state.pageNum = pageNum;
                ctx.state.nav = 'index';
            }
            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_about/about_edit')
        });

        // enterprise
        this.router.get('/admin/enterprise',this.api.isLogin(), async(ctx, next) => {
            let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 12, // 每页显示数量
                showAll: true
            }; // 数据库查询参数

            ctx.state = {}; // 返回的数据初始化
            let totalEnterprise = await this.DBModule.Enterprise.findTotalEnterprise({}); // 获取企业风采总数
            let total = totalEnterprise.count; // 企业风采总条数
            let result = await this.DBModule.Enterprise.findEnterpriseList(queryParams); // 当前查询条件下的荣誉资质
            let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
            let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
            let responseData = {
                pageNum: queryParams.pageNum,
                pageSize: queryParams.pageSize,
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                total: total,
                enterpriseData: result.data,
                nav: 'enterprise',
                requestUrl: '../admin/enterprise?page='
            };
            ctx.state = responseData;


            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_about/enterprise')
        });

        // enterprise 详情
        this.router.get('/admin/enterprise_detail',this.api.isLogin(), async(ctx, next) => {
            let enterpriseId = ctx.request.query.id;
            let pageNum = ctx.request.query.page || 1;
            let enterprise = await this.DBModule.Enterprise.findEnterprise({_id: enterpriseId});
            if (enterprise.status) {
                ctx.state.enterpriseData = enterprise.data[0];
                ctx.state.pageNum = pageNum;
                ctx.state.nav = 'enterprise';
            }

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_about/about_edit')
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
                    "code": 500,
                    "msg": "账号或密码错误"
                }
            }
        });

        // index-修改状态
        this.router.post('/honor/status',this.api.isLogin(), async(ctx, next) => {
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
        this.router.post('/honor/delete', this.api.isLogin(), async(ctx, next) => {
            let honorId = ctx.request.body.id;
            let imgUrl = ctx.request.body.imgUrl;
            let deleteHonor = await this.DBModule.Honor.deleteHonor({_id: honorId}); // 获取荣誉资质总条数
            let deleteImg = await this.api.removeFiles(imgUrl);
            if (deleteHonor.status && deleteImg.status) {
                ctx.body = {
                    "code": 0,
                    "msg": deleteHonor.msg
                };
            } else if (!deleteImg) {
                ctx.body = {
                    "code": 0,
                    "msg": "图片删除失败"
                };
            } else {
                ctx.body = {
                    "code": 500,
                    "msg": deleteHonor.msg
                };
            }
        });

        // index-通用图片上传
        this.router.post('/upload/about',this.api.isLogin(), upload.single('file'), async (ctx, next) => {
            var requestBody = ctx.req.file;
            if (this._.isEmpty(requestBody)) {
                ctx.body = { code: 500, msg: "上传失败" };
                return false;
            }
            let reNameResult = await this.api.renameFiles([requestBody], "public/uploads/temporary/");
            var resultsPath = reNameResult.resultsPath;
            if (reNameResult.status) {
                // var updateResult = await this.DBModule.Activity.updateActivityProgramImg(resultsPath, activityId);
                ctx.body = { code: 0, imgPath: resultsPath };
            } else {
                ctx.body = { code: 500, msg: '保存失败' };
            }
        });

        // index-荣誉资质图片上传
        this.router.post('/honor/add',this.api.isLogin(), async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                var honorInfo = {
                    name: requestBody.name, // 图片名称
                    imgUrl: requestBody.imgUrl, // 荣誉资质图片地址
                    Summary: requestBody.imgDes // 图片概述
                };

                // 判断图片路径是否有更新
                if(honorInfo.imgUrl.indexOf('uploads/temporary') != -1) {
                    let savePath = honorInfo.imgUrl.split('/')[3];
                    let rootPath = process.cwd();
                    let oldPath = path.join(rootPath, '/public/uploads/temporary/' )+ savePath;
                    let newPath = "public/images/front_end/about/honor/" + savePath;
                    let renameResult = await this.api.moveFiles(oldPath, newPath);
                    if (renameResult.status) {
                        honorInfo.imgUrl = renameResult.resultsPath;
                    }
                }

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

        // index-修改荣誉资质
        this.router.post('/honor/edit',this.api.isLogin(), async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                let honorInfo = {
                    name: requestBody.name, // 图片名称
                    imgUrl: requestBody.imgUrl, // 荣誉资质图片地址
                    Summary: requestBody.imgDes, // 图片概述
                    _id: requestBody.id // 图片概述
                };
                
                // 判断图片路径是否有更新
                if(honorInfo.imgUrl.indexOf('uploads/temporary') != -1) {
                    let savePath = honorInfo.imgUrl.split('/')[3];
                    let rootPath = process.cwd();
                    let oldPath = path.join(rootPath, '/public/uploads/temporary/' ) + savePath;
                    let newPath = "public/images/front_end/about/honor/" + savePath;
                    let renameResult = await this.api.moveFiles(oldPath, newPath);
                    if (renameResult.status) {
                        honorInfo.imgUrl = renameResult.resultsPath;
                    }
                }
                let result = await this.DBModule.Honor.changeHonrValue(honorInfo);
                if(result.status) {
                    ctx.body = { code: 0, msg: result.msg };
                } else {
                    ctx.body = { code: 500, msg: result.msg };
                }
            } else {
                ctx.body = { code: 500, msg: '参数错误' };
            }
        });
        

        /**
         * enterprise相关路由
         * */

        // enterprise-修改状态
        this.router.post('/enterprise/status', this.api.isLogin(),async(ctx, next) => {
            let honorId = ctx.request.body.id;
            let status = ctx.request.body.status == 'false'? false: true;
            let changeEnterpriseStatus = await this.DBModule.Enterprise.changeEnterpriseStatus({_id: honorId, hidden: status}); // 获取荣誉资质总条数
            if (changeEnterpriseStatus.status) {
                ctx.body = {
                    "code": 0,
                    "msg": changeEnterpriseStatus.msg
                };
            } else {
                ctx.body = {
                    "code": 200,
                    "msg": changeEnterpriseStatus.msg
                };
            }
        });

        // enterprise-删除特定的荣誉资质
        this.router.post('/enterprise/delete',this.api.isLogin(), async(ctx, next) => {
            let enterpriseId = ctx.request.body.id;
            let imgUrl = ctx.request.body.imgUrl;
            var deleteEnterprise = await this.DBModule.Enterprise.deleteEnterprise({_id: enterpriseId}); // 获取荣誉资质总条数
            let deleteImg = await this.api.removeFiles(imgUrl);
            if (deleteEnterprise.status) {
                ctx.body = {
                    "code": 0,
                    "msg": deleteEnterprise.msg
                };
            } else {
                ctx.body = {
                    "code": 200,
                    "msg": deleteEnterprise.msg
                };
            }
        });

        // enterprise-荣誉资质图片上传
        this.router.post('/enterprise/add',this.api.isLogin(), async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                var enterpriseInfo = {
                    name: requestBody.name, // 图片名称
                    imgUrl: requestBody.imgUrl, // 荣誉资质图片地址
                    Summary: requestBody.imgDes // 图片概述
                };

                // 判断图片路径是否有更新
                if(enterpriseInfo.imgUrl.indexOf('uploads/temporary') != -1) {
                    let savePath = enterpriseInfo.imgUrl.split('/')[3];
                    let rootPath = process.cwd();
                    let oldPath = path.join(rootPath, '/public/uploads/temporary/' ) + savePath;
                    let newPath = "public/images/front_end/about/enterprise_image/" + savePath;
                    let renameResult = await this.api.moveFiles(oldPath, newPath);
                    if (renameResult.status) {
                        enterpriseInfo.imgUrl = renameResult.resultsPath;
                    }
                }

                let result = await this.DBModule.Enterprise.saveEnterprise(enterpriseInfo);
                if(result.status) {
                    ctx.body = { code: 0, msg: result.msg };
                } else {
                    ctx.body = { code: 500, msg: result.msg };
                }
            } else {
                ctx.body = { code: 500, msg: '参数错误' };
            }
        });

        // enterprise-修改荣誉资质
        this.router.post('/enterprise/edit',this.api.isLogin(), async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                let enterpriseInfo = {
                    name: requestBody.name, // 图片名称
                    imgUrl: requestBody.imgUrl, // 荣誉资质图片地址
                    Summary: requestBody.imgDes, // 图片概述
                    _id: requestBody.id // 图片概述
                };

                // 判断图片路径是否有更新
                if(enterpriseInfo.imgUrl.indexOf('uploads/temporary') != -1) {
                    let savePath = enterpriseInfo.imgUrl.split('/')[3];
                    let rootPath = process.cwd();
                    let oldPath = path.join(rootPath, '/public/uploads/temporary/' ) + savePath;
                    let newPath = "public/images/front_end/about/enterprise_image/" + savePath;
                    let renameResult = await this.api.moveFiles(oldPath, newPath);
                    if (renameResult.status) {
                        enterpriseInfo.imgUrl = renameResult.resultsPath;
                    }
                }
                // let reNameResult = await this.api.renameFiles([requestBody], "public/images/uploads/temporary/");
                let result = await this.DBModule.Enterprise.changeEnterpriseValue(enterpriseInfo);
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
