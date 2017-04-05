/**
 * Created by Mahao on 2016/12/9.
 */
import controller from '../tools/controllers'
export default class extends controller {
	renders() {

		// 首页路由
		this.router.get('/', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			var user = {
				userName: 'asdf',
				userPass: 'afdas',
				userDes: 'afsdasf',
				userAvatar: 'asdfas'
			};
			await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_index')
		});

		// 企业概况路由
		this.router.get('/about', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_about/about')
		});

		// 企业概况-发展历程路由
		this.router.get('/about/develop', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_about/develop')
		});

		// 企业概况-荣誉资质路由
		this.router.get('/about/honor', async(ctx, next) => {
            let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 6 // 每页显示数量
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
                requestUrl: '../about/honor?page='
            };
            ctx.state = responseData;
            // await this.DBModule.Honor.saveHonor();

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
			await ctx.render('./front_end_jade/front_end_about/honor')
		});

		// 企业概况-董事长致辞
		this.router.get('/about/speech', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_about/speech')
		});
		
		// 企业概况-企业风采
		this.router.get('/about/enterprise', async(ctx, next) => {
			let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
			let queryParams = {
				pageNum: pageNum, // 当前页数
				pageSize: 9 // 每页显示数量
			}; // 数据库查询参数

			ctx.state = {}; // 返回的数据初始化
			let totalEnterprise = await this.DBModule.Enterprise.findTotalEnterprise({}); // 获取企业风采总条数
			let total = totalEnterprise.count; // 企业风采总条数
			let result = await this.DBModule.Enterprise.findEnterpriseList(queryParams); // 当前查询条件下的企业风采
			let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
			let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
			let responseData = {
				pageNum: queryParams.pageNum,
				pageSize: queryParams.pageSize,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage,
				total: total,
                enterpriseData: result.data,
				requestUrl: '../about/enterprise?page='
			};
			ctx.state = responseData;
            // await this.DBModule.Enterprise.saveEnterprise();

            // 判断是否是debug
			var debug = ctx.request.query._d;
			if (debug == 1) {
				ctx.body = ctx.state;
				return false;
			}

			await ctx.render('./front_end_jade/front_end_about/enterprise')
		});

        // 企业概况-详情
        this.router.get('/about/detail', async(ctx, next) => {
            ctx.state = { }; // 设置state为空对象
            let queryId = ctx.query.id; // 获取企业形象ID
            let queryParams = {
                queryId: ctx.query.id, // 设置企业形象ID
                queryPage: ctx.query.page, // 获取当前页数
                queryType: ctx.query.type // 获取当前页数
            };
            ctx.state.queryParams = queryParams; // 返回查询的参数
            if(queryParams.queryType == 'honor') {
                let presentHonor = await this.DBModule.Honor.findHonor(queryId); // 获取当前企业想想
                ctx.state.honor = presentHonor.data;
                let nextHonor = await this.DBModule.Honor.findHonorNext(queryId); // 获取后一条企业形象
                ctx.state.nextHonor = nextHonor.data;
                let preHonor = await this.DBModule.Honor.findHonorPrevious(queryId); // 获取前一条企业形象
                ctx.state.preHonor = preHonor.data;
            } else {
                let presentEnterprise = await this.DBModule.Enterprise.findEnterprise(queryId); // 获取当前企业想想
                ctx.state.enterprise = presentEnterprise.data;
                let nextEnterprise = await this.DBModule.Enterprise.findEnterpriseNext(queryId); // 获取后一条企业形象
                ctx.state.nextEnterprise = nextEnterprise.data;
                let preEnterprise = await this.DBModule.Enterprise.findEnterprisePrevious(queryId); // 获取前一条企业形象
                ctx.state.preEnterprise = preEnterprise.data;
            }

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./front_end_jade/front_end_about/about_detail')
        });

        // 工程技术中心-质保体系
        this.router.get('/program/quality', async(ctx, next) => {
            ctx.state = {};
            await ctx.render('./front_end_jade/front_end_program/quality')
        });

        // 工程技术中心-常见问题
        this.router.get('/program/question', async(ctx, next) => {
            ctx.state = {};
            await ctx.render('./front_end_jade/front_end_program/question')
        });

		// 联系我们路由
		this.router.get('/contact', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_program/contact')
		});

		// 加入我们路由
		this.router.get('/join', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_joinus/join')
		})
	}
	
	actions() {

	}
}
