/**
 * Created by Mahao on 2017/3/30.
 */
import controller from '../tools/controllers'
export default class extends controller {
	renders() {

		// 公司新闻路由
		this.router.get('/news/company', async(ctx, next) => {
			let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            // console.log(ctx.query.page);
			let queryParams = {
				pageNum: pageNum, // 当前页数
				pageSize: 8, // 每页显示数量
                newsType: 'company' // 新闻类型
			}; // 数据库查询参数

			ctx.state = {}; // 返回的数据
			let totalNews = await this.DBModule.News.findTotalNews({newsType: 'company'}); // 获取公司新闻总条数
            let total = totalNews.count; // 新闻总条数
            let result = await this.DBModule.News.findNewsList(queryParams); // 当前查询条件下的新闻数据
            let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
            let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
			let responseData = {
				pageNum: queryParams.pageNum,
				pageSize: queryParams.pageSize,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage,
                total: total,
                newsData: result.data,
                requestUrl: '../news/company?page='
			};
            ctx.state = responseData;

            // 热点推荐
            let recommend = ctx.session.recommend || '';
            ctx.state.hotRecommend = recommend;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./front_end_jade/front_end_news/company_news')
		});

		// 行业新闻路由
		this.router.get('/news/industry', async(ctx, next) => {
            let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            // console.log(ctx.query.page);
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 2, // 每页显示数量
                newsType: 'industry' // 新闻类型
            }; // 数据库查询参数

            ctx.state = {}; // 返回的数据初始化
            let totalNews = await this.DBModule.News.findTotalNews({newsType: 'industry'}); // 获取industry新闻总条数
            let total = totalNews.count; // 新闻总条数
            let result = await this.DBModule.News.findNewsList(queryParams); // 当前查询条件下的新闻数据
            let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
            let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
            let responseData = {
                pageNum: queryParams.pageNum,
                pageSize: queryParams.pageSize,
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                total: total,
                newsData: result.data,
                requestUrl: '../news/industry?page='
            };
            ctx.state = responseData;

            // 热点推荐
            let recommend = ctx.session.recommend || '';
            ctx.state.hotRecommend = recommend;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
			await ctx.render('./front_end_jade/front_end_news/industry_news')
		});

		// 新闻详情路由
		this.router.get('/news/detail', async(ctx, next) => {
			ctx.state = { }; // 设置state为空对象
			let newsId = ctx.query.id; // 获取新闻的ID
			// await this.DBModule.News.saveNews(); // 获取当前新闻
			ctx.state.nowNews = await this.DBModule.News.findNews(newsId); // 获取当前新闻
			ctx.state.nextNews = await this.DBModule.News.findNewsNext(newsId); // 获取后一条新闻
			ctx.state.lastNews = await this.DBModule.News.findNewsPrevious(newsId); // 获取前一条新闻

            // 热点推荐
            let recommend = ctx.session.recommend || '';
            ctx.state.hotRecommend = recommend;
            
            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
			await ctx.render('./front_end_jade/front_end_news/detail_news')
		});
	}

	actions() {

	}
}
