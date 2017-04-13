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
            ctx.state.nav = 'news';
            ctx.state.pageNum = ctx.request.query.page;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_news/news_edit')
        });

        // 编辑产品
        this.router.get('/admin/product_detail', async(ctx, next) => {
            let newsId = ctx.request.query.id;
            let pageNum = ctx.request.query.page || 1;
            let news = await this.DBModule.News.findNews({_id: newsId}); // 获取荣誉资质总条数
            if (news.status) {
                ctx.state.newsData = news.data[0]; // 获取第一个元素
                ctx.state.pageNum = pageNum;
                ctx.state.nav = 'news';
            }

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_news/news_edit')
        });
    }

    actions() {

        // 修改产品状态
        this.router.post('/product/status', async(ctx, next) => {
            let productId = ctx.request.body.id;
            let series = ctx.request.body.series;
            let status = ctx.request.body.status == 'false'? false: true;
            if (series == 'pump') {
                var changeStatus = await this.DBModule.Pump.changePumpStatus({_id: productId, hidden: status}); // 修改泵类产品状态
            } else {
                var changeStatus = await this.DBModule.Seal.changeSealStatus({_id: productId, hidden: status}); // 修改密封产品状态
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

        // 删除指定的新闻
        this.router.post('/news/delete', async(ctx, next) => {
            let newsId = ctx.request.body.id;
            // let imgUrl = ctx.request.body.imgUrl; // 暂时不删除新闻图片
            let deleteNews = await this.DBModule.News.deleteNews({_id: newsId}); // 获取荣誉资质总条数
            // let deleteImg = await this.api.removeFiles(imgUrl); // 暂时不删除图片
            if (deleteNews.status) {
                ctx.body = {
                    "code": 0,
                    "msg": deleteNews.msg
                };
            } else {
                ctx.body = {
                    "code": 200,
                    "msg": deleteNews.msg
                };
            }
        });

        // 通用图片上传
        this.router.post('/upload/news',upload.single('file'), async (ctx, next) => {
            var requestBody = ctx.req.file;

            if (this._.isEmpty(requestBody)) {
                ctx.body = { code: 500, msg: "上传失败" };
                return false;
            }
            let reNameResult = await this.api.renameFiles([requestBody], "public/images/front_end/news/");
            var resultsPath = reNameResult.resultsPath;
            if (reNameResult.status) {
                ctx.body = { code: 0, imgPath: resultsPath };
            } else {
                ctx.body = { code: 500, msg: '保存失败' };
            }
        });

        // 新增新闻
        this.router.post('/news/add', async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                var newsInfo = {
                    content: requestBody.newsContent,  // 获取markdown的值
                    title: requestBody.newsTitle,
                    subTitle: requestBody.newsSubtitle,
                    newsType: requestBody.newsType,
                    author: requestBody.newsAuthor,
                    origin: requestBody.newsOrigin,
                    tags: requestBody.newsTag
                };
                let result = await this.DBModule.News.saveNews(newsInfo);
                if(result.status) {
                    ctx.body = { code: 0, msg: result.msg };
                } else {
                    ctx.body = { code: 500, msg: result.msg };
                }
            } else {
                ctx.body = { code: 500, msg: '参数错误' };
            }
        });

        // 修改新闻
        this.router.post('/news/edit', async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                var newsInfo = {
                    content: requestBody.newsContent,  // 获取markdown的值
                    title: requestBody.newsTitle,
                    subTitle: requestBody.newsSubtitle,
                    newsType: requestBody.newsType,
                    author: requestBody.newsAuthor,
                    origin: requestBody.newsOrigin,
                    tags: requestBody.newsTag,
                    _id: requestBody.id
                };

                // 判断图片路径是否有更新
                // if(honorInfo.imgUrl.indexOf('uploads/temporary') != -1) {
                //     let savePath = honorInfo.imgUrl.split('/')[3];
                //     let oldPath = 'public\\uploads\\temporary\\' + savePath;
                //     let newPath = "public/images/front_end/about/honor/" + savePath;
                //     let renameResult = await this.api.moveFiles(oldPath, newPath);
                //     if (renameResult.status) {
                //         honorInfo.imgUrl = renameResult.resultsPath;
                //     }
                // }
                let result = await this.DBModule.News.changeNewsValue(newsInfo);
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
