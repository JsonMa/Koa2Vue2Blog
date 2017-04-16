/**
 * Created by Administrator on 2017/4/15.
 */
import controller from '../tools/controllers'
import multer from 'koa-multer';
const upload = multer({ dest: 'public/uploads/' });

export default class extends controller {
    renders() {

        // 加入我们
        this.router.get('/admin/join', this.api.isLogin(), async(ctx, next) => {
            let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
            let queryParams = {
                pageNum: pageNum, // 当前页数
                pageSize: 12, // 每页显示数量
                showAll: true
            }; // 数据库查询参数


            ctx.state = {}; // 返回的数据初始化
            let totalHonor = await this.DBModule.Job.findTotalJob({}); // 获取工作岗位总数
            let total = totalHonor.count; // 工作岗位总条数
            let result = await this.DBModule.Job.findJobList(queryParams); // 当前查询条件下的工作岗位
            let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
            let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
            let responseData = {
                pageNum: queryParams.pageNum,
                pageSize: queryParams.pageSize,
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                total: total,
                jobData: result.data,
                nav: 'join',
                requestUrl: '../admin/job?page='
            };
            ctx.state = responseData;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_job/job')
        });

        // 新增工作岗位
        this.router.get('/admin/job_add', this.api.isLogin(), async(ctx, next) => {
            ctx.state.nav = 'join';
            ctx.state.pageNum = ctx.request.query.page;

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_job/job_edit')
        });

        // 编辑工作岗位
        this.router.get('/admin/job_edit', this.api.isLogin(), async(ctx, next) => {
            let jobId = ctx.request.query.id;
            let pageNum = ctx.request.query.page || 1;
            let news = await this.DBModule.Job.findJob({_id: jobId}); // 获取荣誉资质总条数
            if (news.status) {
                ctx.state.jobData = news.data[0]; // 获取第一个元素
                ctx.state.pageNum = pageNum;
                ctx.state.nav = 'join';
            }

            // 判断是否是debug
            var debug = ctx.request.query._d;
            if (debug == 1) {
                ctx.body = ctx.state;
                return false;
            }
            await ctx.render('./back_end_jade/back_end_job/job_edit')
        });
    }

    actions() {

        // 修改工作岗位状态
        this.router.post('/job/status', this.api.isLogin(), async(ctx, next) => {
            let jobId = ctx.request.body.id;
            let status = ctx.request.body.status == 'false'? false: true;
            let changeJobStatus = await this.DBModule.Job.changeJobStatus({_id: jobId, hidden: status}); // 获取荣誉资质总条数
            if (changeJobStatus.status) {
                ctx.body = {
                    "code": 0,
                    "msg": changeJobStatus.msg
                };
            } else {
                ctx.body = {
                    "code": 500,
                    "msg": changeJobStatus.msg
                };
            }
        });

        // 删除指定的工作岗位
        this.router.post('/job/delete', this.api.isLogin(), async(ctx, next) => {
            let jobId = ctx.request.body.id;
            let deleteJob = await this.DBModule.Job.deleteJob({_id: jobId}); // 删除置顶的工作岗位
            if (deleteJob.status) {
                ctx.body = {
                    "code": 0,
                    "msg": deleteJob.msg
                };
            } else {
                ctx.body = {
                    "code": 500,
                    "msg": deleteJob.msg
                };
            }
        });

        // 新增工作岗位
        this.router.post('/job/add', this.api.isLogin(), async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                var jobInfo = {
                    jobDescribe: requestBody.jobDescribe,  // 获取markdown的值
                    jobDemand: requestBody.jobDemand,
                    jobName: requestBody.jobName,
                    jobType: requestBody.jobType,
                };
                let result = await this.DBModule.Job.saveJob(jobInfo);
                if(result.status) {
                    ctx.body = { code: 0, msg: result.msg };
                } else {
                    ctx.body = { code: 500, msg: result.msg };
                }
            } else {
                ctx.body = { code: 500, msg: '参数错误' };
            }
        });

        // 修改工作岗位
        this.router.post('/job/edit', this.api.isLogin(), async (ctx, next) => {
            var requestBody = ctx.request.body;
            if (requestBody) {
                var jobInfo = {
                    jobDescribe: requestBody.jobDescribe,  // 获取markdown的值
                    jobDemand: requestBody.jobDemand,
                    jobName: requestBody.jobName,
                    jobType: requestBody.jobType,
                    _id: requestBody.id
                };
                let result = await this.DBModule.Job.changeJobValue(jobInfo);
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
