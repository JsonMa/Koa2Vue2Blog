/**
 * Created by Administrator on 2017/4/15.
 */
import controller from '../tools/controllers'

export default class extends controller {
  renders () {
    // 联系我们
    this.router.get('/admin/contact', this.api.isLogin(), async (ctx, next) => {
      let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1 // 获取页数
      let queryParams = {
        pageNum: pageNum, // 当前页数
        pageSize: 12, // 每页显示数量
        showAll: true
      } // 数据库查询参数

      ctx.state = {} // 返回的数据初始化
      let totalHonor = await this.DBModule.Contact.findTotalContact({}) // 获取所有留言
      let total = totalHonor.count // 留言总数
      let result = await this.DBModule.Contact.findContactList(queryParams) // 当前查询条件下的留言
      let isFirstPage = queryParams.pageNum - 1 === 0 // 是否第一页
      let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) === total // 是否最后一页
      let responseData = {
        pageNum: queryParams.pageNum,
        pageSize: queryParams.pageSize,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        total: total,
        contactData: result.data,
        nav: 'contact',
        requestUrl: '../admin/contact?page='
      }
      ctx.state = responseData

      // 判断是否是debug
      var debug = ctx.request.query._d
      if (debug === 1) {
        ctx.body = ctx.state
        return false
      }
      await ctx.render('./back_end_jade/back_end_contact/contact')
    })
  }

  actions () {
    // 删除指定的新闻
    this.router.post('/contact/delete', this.api.isLogin(), async (ctx, next) => {
      let contactId = ctx.request.body.id
      let deleteNews = await this.DBModule.Contact.deleteContact({
        _id: contactId
      }) // 删除置顶的留言
      if (deleteNews.status) {
        ctx.body = {
          'code': 0,
          'msg': deleteNews.msg
        }
      } else {
        ctx.body = {
          'code': 200,
          'msg': deleteNews.msg
        }
      }
    })

    // 新增留言
    this.router.get('/contact/add', this.api.isLogin(), async (ctx, next) => {
      var requestBody = ctx.query
      if (requestBody) {
        var contactInfo = {
          name: requestBody.name, // 留言人名称
          phone: requestBody.phone, // 留言人电话
          email: requestBody.email, // 电子邮件
          content: requestBody.content // 留言内容
        }
        let result = await this.DBModule.Contact.saveContact(contactInfo)
        if (result.status) {
          ctx.body = {
            code: 0,
            msg: result.msg
          }
        } else {
          ctx.body = {
            code: 500,
            msg: result.msg
          }
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '参数错误'
        }
      }
    })
  }
}
