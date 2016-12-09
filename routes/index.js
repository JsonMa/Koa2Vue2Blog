/**
 * Created by Mahao on 2016/12/9.
 */
import controller from './tools/controllers'
export default class extends controller {
	renders() {
		this.router.get('/', async(ctx, next) => {
			let user = {
				userName: 'mahao',
				userPass: 'asdfsaf',
				userDes: 'asdfa',
				userAvatar: '这是我乱写的',
			};
			ctx.state= {
				title: '成功了'
			};
			await this.Users.saveUser(user);
			await ctx.render('index')
		})
	}
	
	actions() {

	}
}
