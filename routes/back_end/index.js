/**
 * Created by Mahao on 2017/4/7.
 */
import controller from '../tools/controllers'
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
            if (userName === 'admin' && userPassw==='cqyir') {
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
    }
}
