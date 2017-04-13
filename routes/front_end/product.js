/**
 * Created by Administrator on 2017/3/31.
 */
import controller from '../tools/controllers'
export default class extends controller {
    renders() {

        // 产品中心--泵
        this.router.get('/product/pumps', async(ctx, next) => {
            let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            let series = ctx.query.series; // 获取系列类型
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 5, // 每页显示数量
                pumpType: series, // 泵类型
                showAll: false
            }; // 数据库查询参数
            
            ctx.state = {}; // 返回的数据
            let totalPumps = await this.DBModule.Pumps.findTotalPump({pumpType: queryParams.pumpType, hidden: false}); // 获取泵总条数
            let total = totalPumps.count; // 泵总条数
            let result = await this.DBModule.Pumps.findPumpList(queryParams); // 当前查询条件下的新闻数据
            let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
            let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
            let responseData = {
                pageNum: queryParams.pageNum,
                pageSize: queryParams.pageSize,
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                total: total,
                series: series,
                pumpData: result.data,
                requestUrl: '../product/pumps?page='
            };
            ctx.state = responseData;

            // 热点推荐
            let recommend = ctx.session.recommend || '';
            ctx.state.hotRecommend = recommend;
            // await this.DBModule.Pumps.savePump(); // 保存泵

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./front_end_jade/front_end_product/product')
        });

        // 产品中心--密封
        this.router.get('/product/seals', async(ctx, next) => {
            let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 12, // 每页显示数量
                sealType: 'common',
                showAll: false// 密封类型
            }; // 数据库查询参数

            ctx.state = {}; // 返回的数据初始化
            let totalNews = await this.DBModule.Seals.findTotalSeal({sealType: 'common', hidden: false}); // 获取industry新闻总条数
            let total = totalNews.count; // 新闻总条数
            let result = await this.DBModule.Seals.findSealList(queryParams); // 当前查询条件下的新闻数据
            let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
            let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
            let responseData = {
                pageNum: queryParams.pageNum,
                pageSize: queryParams.pageSize,
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                total: total,
                sealData: result.data,
                series: 'seal',
                requestUrl: '../product/seals?page='
            };
            ctx.state = responseData;

            // 热点推荐
            let recommend = ctx.session.recommend || '';
            ctx.state.hotRecommend = recommend;

            // await this.DBModule.Seals.saveSeal(); // 保存泵
            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./front_end_jade/front_end_product/product')
        });

        // 产品详情
        this.router.get('/product/detail', async(ctx, next) => {
            ctx.state = { }; // 设置state为空对象
            let productId = ctx.query.id; // 获取产品的ID
            let queryParams = {
                queryId: ctx.query.id,
                queryPage: ctx.query.page,
                queryType: ctx.query.type,
                series: ctx.query.series
            };
            ctx.state.queryParams = queryParams; // 返回查询的参数
            if (queryParams.series == 'seal') {
                ctx.state.sealProduct = await this.DBModule.Seals.findSeal(productId); // 获取当前产品信息
            } else {
                ctx.state.pumpProduct = await this.DBModule.Pumps.findPump(productId); // 获取当前产品信息
            }
            // ctx.state.nextProduct = await this.DBModule.Pumps.findPumpNext(productId); // 获取后一条新闻
            // ctx.state.lastPr = await this.DBModule.Pumps.findPumpPrevious(productId); // 获取前一条新闻

            // 热点推荐
            let recommend = ctx.session.recommend || '';
            ctx.state.hotRecommend = recommend;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./front_end_jade/front_end_product/product_detail')
        });
    }

    actions() {

    }
}
