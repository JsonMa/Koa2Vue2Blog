/**
 * Created by Mahao on 2016/12/9.
 */
import controller from './tools/controllers'
export default class extends controller {
	renders() {
		this.router.get('/', async(ctx, next) => {
			ctx.state= {

			};
			await ctx.render('index')
		})
	}
	
	actions() {
		
	}
}