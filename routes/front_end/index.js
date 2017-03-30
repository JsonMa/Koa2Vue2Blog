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
			// await this.DBModule.Users.saveUser(user);
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
			let user = {
				userName: 'mahao',
				userPass: 'asdfsaf',
				userDes: 'asdfa',
				userAvatar: '这是我乱写的'
			};
			ctx.state = {
				title: '成功了',
				user: user,
				honorData: [{
					imgUrl: '',
					title:'',
					id:''
				}]
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_about/honor')
		});

		// 企业概况-荣誉资质路由
		this.router.get('/about/speech', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_about/speech')
		});

		// 联系我们路由
		this.router.get('/contact', async(ctx, next) => {
			ctx.state = {
				title: '成功了'
			};
			// await this.DBModule.Users.saveUser(user);
			await ctx.render('./front_end_jade/front_end_contact/contact')
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
