/**
 * Created by Mahao on 2017/4/13.
 */
import controller from '../tools/controllers'
import multer from 'koa-multer';
const upload = multer({ dest: 'public/uploads/' });

export default class extends controller {
    renders() {

        // 产品管理
        this.router.get('/admin/product', async(ctx, next) => {
            let pageNum = ctx.query.page? parseInt(ctx.query.page) : 1; // 获取页数
            let series = ctx.query.series? ctx.query.series: 'pump'; // 获取页数
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 12, // 每页显示数量
                showAll: true
            }; // 数据库查询参数
            ctx.state = {}; // 返回的数据初始化

            if(series == 'pump') {
                let totalPump = await this.DBModule.Pumps.findTotalPump({}); // 获取泵产品总数
                let total = totalPump.count; // 泵产品总数总条数
                let result = await this.DBModule.Pumps.findPumpList(queryParams); // 当前查询条件下的泵
                let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
                let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
                var responseData = {
                    pageNum: queryParams.pageNum,
                    pageSize: queryParams.pageSize,
                    isFirstPage: isFirstPage,
                    isLastPage: isLastPage,
                    total: total,
                    pumpData: result.data,
                    nav: 'pump',
                    requestUrl: '../admin/product?series=' + series +'&page='
                };
            } else if(series == 'seal') {
                let totalSeal = await this.DBModule.Seals.findTotalSeal({}); // 获取新闻总数
                let total = totalSeal.count; // 新闻总条数
                let result = await this.DBModule.Seals.findSealList(queryParams); // 当前查询条件下的新闻
                let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
                let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
                var responseData = {
                    pageNum: queryParams.pageNum,
                    pageSize: queryParams.pageSize,
                    isFirstPage: isFirstPage,
                    isLastPage: isLastPage,
                    total: total,
                    sealData: result.data,
                    nav: 'seal',
                    requestUrl: '../admin/product?series=' + series +'&page='
                };
            }
            ctx.state = responseData;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_product/product')
        });

        // 新增产品
        this.router.get('/admin/product_add', async(ctx, next) => {
            let series = ctx.request.query.series;
            ctx.state.nav = series;
            ctx.state.pageNum = ctx.request.query.page;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_product/product_edit')
        });

        // 修改产品
        this.router.get('/admin/product_edit', async(ctx, next) => {
            let newsId = ctx.request.query.id;
            let series = ctx.request.query.series;
            let pageNum = ctx.request.query.page || 1;
            if(series == 'pump') {
                let product = await this.DBModule.Pumps.findPump({_id: newsId}); // 获取荣誉资质总条数
                if (product.status) {
                    ctx.state.pumpData = product.data[0]; // 获取第一个元素
                    ctx.state.pageNum = pageNum;
                    ctx.state.nav = series;
                }
            } else {
                let product = await this.DBModule.Seals.findSeal({_id: newsId}); // 获取荣誉资质总条数
                if (product.status) {
                    ctx.state.sealData = product.data[0]; // 获取第一个元素
                    ctx.state.pageNum = pageNum;
                    ctx.state.nav = series;
                }
            }

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_product/product_edit')
        });
    }

    actions() {

        // 修改产品状态
        this.router.post('/product/status', async(ctx, next) => {
            let productId = ctx.request.body.id;
            let series = ctx.request.body.series;
            let status = ctx.request.body.status == 'false'? false: true;
            if (series == 'pump') {
                var changeStatus = await this.DBModule.Pumps.changePumpStatus({_id: productId, hidden: status}); // 修改泵类产品状态
            } else {
                var changeStatus = await this.DBModule.Seals.changeSealStatus({_id: productId, hidden: status}); // 修改密封产品状态
            }
            if (changeStatus.status) {
                ctx.body = {
                    "code": 0,
                    "msg": changeStatus.msg
                };
            } else {
                ctx.body = {
                    "code": 200,
                    "msg": changeStatus.msg
                };
            }
        });

        // 删除指定的产品
        this.router.post('/product/delete', async(ctx, next) => {
            let productId = ctx.request.body.id,
                series = ctx.request.body.series,
                imgUrl = ctx.request.body.imgUrl, // 产品图
                imgStructUrl = ctx.request.body.imgStructUrl; // 产品结构图
            console.log(imgUrl);
            if(series == 'pump') {
                var deleteProduct = await this.DBModule.Pumps.deletePump({_id: productId});
                var deleteImg = await this.api.removeFiles(imgUrl);
            } else {
                var deleteProduct = await this.DBModule.Seals.deleteSeal({_id: productId});
                var deleteImg = await this.api.removeFiles(imgUrl);
                var deleteStructImg = await this.api.removeFiles(imgStructUrl);
            }
            if (deleteProduct.status && deleteImg.status) {
                ctx.body = {
                    "code": 0,
                    "msg": deleteProduct.msg
                };
            } else if (!deleteImg.status) {
                ctx.body = {
                    "code": 0,
                    "msg": "产品图删除失败"
                };
            } else if (!deleteStructImg.status) {
                ctx.body = {
                    "code": 0,
                    "msg": "结构图删除失败"
                };
            } else {
                ctx.body = {
                    "code": 500,
                    "msg": deleteProduct.msg
                };
            }
        });

        // 通用图片上传
        this.router.post('/upload/product',upload.single('file'), async (ctx, next) => {
            var requestBody = ctx.req.file;
            if (this._.isEmpty(requestBody)) {
                ctx.body = { code: 500, msg: "上传失败" };
                return false;
            }
            let reNameResult = await this.api.renameFiles([requestBody], "public/uploads/temporary/");
            var resultsPath = reNameResult.resultsPath;
            if (reNameResult.status) {
                ctx.body = { code: 0, imgPath: resultsPath };
            } else {
                ctx.body = { code: 500, msg: '保存失败' };
            }
        });

        // 新增泵类产品
        this.router.get('/product/add_pump', async (ctx, next) => {
            var requestBody = ctx.query;
            if (requestBody) {
                var pumpInfo = {
                    name: requestBody.name, // 泵名称
                    safeStage: requestBody.safeStage, // 安全等级
                    imgUrl: requestBody.imgUrl, // 泵图片地址
                    params: {
                        structure: requestBody.structure,
                        standard: requestBody.standard,
                        flow: requestBody.flow,
                        high: requestBody.high,
                        temperature: requestBody.temperature,
                        pressure: requestBody.pressure
                    }, // 泵参数
                    stage: {
                        safe: requestBody.safe,
                        manufacture: requestBody.manufacture,
                        warranty: requestBody.warranty,
                        antiSeismic: requestBody.antiSeismic,
                        clean: requestBody.clean
                    }, // 设备分级
                    pumpType: requestBody.pumpType,
                    area: requestBody.area, // 使用范围
                    Summary: requestBody.Summary // 产品概述
                };

                // 判断图片路径是否有更新
                if(pumpInfo.imgUrl.indexOf('uploads/temporary') != -1) {
                    let savePath = pumpInfo.imgUrl.split('/')[3];
                    let oldPath = 'public\\uploads\\temporary\\' + savePath;
                    let newPath = "public/images/front_end/product/pump/" + savePath;
                    let renameResult = await this.api.moveFiles(oldPath, newPath);
                    if (renameResult.status) {
                        pumpInfo.imgUrl = renameResult.resultsPath;
                    }
                }
                let result = await this.DBModule.Pumps.savePump(pumpInfo);
                if(result.status) {
                    ctx.body = { code: 0, msg: result.msg };
                } else {
                    ctx.body = { code: 500, msg: result.msg };
                }
            } else {
                ctx.body = { code: 500, msg: '参数错误' };
            }
        });

        // 新增密封类产品
        this.router.get('/product/add_seal', async (ctx, next) => {
            var requestBody = ctx.query;
            if (requestBody) {
                var sealInfo = {
                    name: requestBody.name, // 密封名称
                    imgUrl: requestBody.imgUrl, // 密封缩略图
                    imgStructureUrl: requestBody.imgStructureUrl, // 密封结构图
                    standards: requestBody.standards, // 产品执行标准
                    features: requestBody.features, // 产品特点
                    params: {
                        speed: requestBody.speed, // 转速
                        shaft: requestBody.shaft, // 轴径
                        temperature: requestBody.temperature, // 温度
                        pressure: requestBody.pressure // 压力
                    }, // 密封使用参数
                    sealType: requestBody.sealType, // 泵类型
                };
                let result = await this.DBModule.Seals.saveSeal(sealInfo);
                if(result.status) {
                    ctx.body = { code: 0, msg: result.msg };
                } else {
                    ctx.body = { code: 500, msg: result.msg };
                }
            } else {
                ctx.body = { code: 500, msg: '参数错误' };
            }
        });

        // 修改泵类产品
        this.router.get('/product/edit_pump', async (ctx, next) => {
            var requestBody = ctx.query;
            // ctx.body = { code: 0, msg: '上传成功', data: requestBody};
            if (requestBody) {
                var pumpId = requestBody._id;
                var pumpInfo = {
                    name: requestBody.name, // 泵名称
                    safeStage: requestBody.safeStage, // 安全等级
                    imgUrl: requestBody.imgUrl, // 泵图片地址
                    params: {
                        structure: requestBody.structure,
                        standard: requestBody.standard,
                        flow: requestBody.flow,
                        high: requestBody.high,
                        temperature: requestBody.temperature,
                        pressure: requestBody.pressure
                    }, // 泵参数
                    stage: {
                        safe: requestBody.safe,
                        manufacture: requestBody.manufacture,
                        warranty: requestBody.warranty,
                        antiSeismic: requestBody.antiSeismic,
                        clean: requestBody.clean
                    }, // 设备分级
                    pumpType: requestBody.pumpType,
                    area: requestBody.area, // 使用范围
                    Summary: requestBody.Summary // 产品概述
                };

                // 判断图片路径是否有更新
                if(pumpInfo.imgUrl.indexOf('uploads/temporary') != -1) {
                    let savePath = pumpInfo.imgUrl.split('/')[3];
                    let oldPath = 'public\\uploads\\temporary\\' + savePath;
                    let newPath = "public/images/front_end/product/pump/" + savePath;
                    let renameResult = await this.api.moveFiles(oldPath, newPath);
                    if (renameResult.status) {
                        pumpInfo.imgUrl = renameResult.resultsPath;
                    }
                }
                let result = await this.DBModule.Pumps.changePumpValue(pumpId,pumpInfo);
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
