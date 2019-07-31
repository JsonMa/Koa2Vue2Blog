/**
 * Created by Mahao on 2017/4/12.
 */
import controller from '../tools/controllers'
import multer from 'koa-multer';
const upload = multer({
  dest: 'public/uploads/'
});

export default class extends controller {
  renders() {

    // 新闻管理
    this.router.get('/admin/news', this.api.isLogin(), async (ctx, next) => {
      let pageNum = ctx.query.page ? parseInt(ctx.query.page) : 1; // 获取页数
      let queryParams = {
        pageNum: pageNum, // 当前页数
        pageSize: 12, // 每页显示数量
        showAll: true
      }; // 数据库查询参数

      ctx.state = {}; // 返回的数据初始化
      let totalHonor = await this.DBModule.News.findTotalNews({}); // 获取新闻总数
      let total = totalHonor.count; // 新闻总条数
      let result = await this.DBModule.News.findNewsList(queryParams); // 当前查询条件下的新闻
      let isFirstPage = queryParams.pageNum - 1 == 0; //　是否第一页
      let isLastPage = ((queryParams.pageNum - 1) * queryParams.pageSize + result.data.length) == total; // 是否最后一页
      let responseData = {
        pageNum: queryParams.pageNum,
        pageSize: queryParams.pageSize,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        total: total,
        newsData: result.data,
        nav: 'news',
        requestUrl: '../admin/news?page='
      };
      ctx.state = responseData;

      // 判断是否是debug
      var debug = ctx.request.query._d;
      if (debug == 1) {
        ctx.body = ctx.state;
        return false;
      }
      await ctx.render('./back_end_jade/back_end_news/news')
    });

    // 新增新闻
    this.router.get('/admin/news_add', this.api.isLogin(), async (ctx, next) => {
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

    // 编辑新闻
    this.router.get('/admin/news_detail', this.api.isLogin(), async (ctx, next) => {
      let newsId = ctx.request.query.id;
      let pageNum = ctx.request.query.page || 1;
      let news = await this.DBModule.News.findNews({
        _id: newsId
      }); // 获取荣誉资质总条数
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

    // 新闻修改状态
    this.router.post('/news/status', this.api.isLogin(), async (ctx, next) => {
      let newsId = ctx.request.body.id;
      let status = ctx.request.body.status == 'false' ? false : true;
      let changeNewsStatus = await this.DBModule.News.changeNewsStatus({
        _id: newsId,
        hidden: status
      }); // 获取荣誉资质总条数
      if (changeNewsStatus.status) {
        ctx.body = {
          "code": 0,
          "msg": changeNewsStatus.msg
        };
      } else {
        ctx.body = {
          "code": 200,
          "msg": changeNewsStatus.msg
        };
      }
    });

    // 删除指定的新闻
    this.router.post('/news/delete', this.api.isLogin(), async (ctx, next) => {
      let newsId = ctx.request.body.id;
      // let imgUrl = ctx.request.body.imgUrl; // 暂时不删除新闻图片
      let deleteNews = await this.DBModule.News.deleteNews({
        _id: newsId
      }); // 获取荣誉资质总条数
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
    this.router.post('/upload/news', this.api.isLogin(), upload.single('file'), async (ctx, next) => {
      var requestBody = ctx.req.file;

      if (this._.isEmpty(requestBody)) {
        ctx.body = {
          code: 500,
          msg: "上传失败"
        };
        return false;
      }
      let reNameResult = await this.api.renameFiles([requestBody], "public/images/front_end/news/");
      var resultsPath = reNameResult.resultsPath;
      if (reNameResult.status) {
        ctx.body = {
          code: 0,
          imgPath: resultsPath
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '保存失败'
        };
      }
    });

    // 新增新闻
    this.router.post('/news/add', this.api.isLogin(), async (ctx, next) => {
      var requestBody = ctx.request.body;
      if (requestBody) {
        var newsInfo = {
          content: requestBody.newsContent, // 获取markdown的值
          title: requestBody.newsTitle,
          subTitle: requestBody.newsSubtitle,
          newsType: requestBody.newsType,
          author: requestBody.newsAuthor,
          origin: requestBody.newsOrigin,
          tags: requestBody.newsTag
        };
        let result = await this.DBModule.News.saveNews(newsInfo);
        if (result.status) {
          ctx.body = {
            code: 0,
            msg: result.msg
          };
        } else {
          ctx.body = {
            code: 500,
            msg: result.msg
          };
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '参数错误'
        };
      }
    });

    // 修改新闻
    this.router.post('/news/edit', this.api.isLogin(), async (ctx, next) => {
      var requestBody = ctx.request.body;
      if (requestBody) {
        var newsInfo = {
          content: requestBody.newsContent, // 获取markdown的值
          title: requestBody.newsTitle,
          subTitle: requestBody.newsSubtitle,
          newsType: requestBody.newsType,
          author: requestBody.newsAuthor,
          origin: requestBody.newsOrigin,
          tags: requestBody.newsTag,
          _id: requestBody.id
        };

        let result = await this.DBModule.News.changeNewsValue(newsInfo);
        if (result.status) {
          ctx.body = {
            code: 0,
            msg: result.msg
          };
        } else {
          ctx.body = {
            code: 500,
            msg: result.msg
          };
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '参数错误'
        };
      }
    });

    // 修改新闻
    this.router.post('/admin/test', this.api.isLogin(), async (ctx, next) => {
      ctx.body = {
        code: 500,
        msg: '参数错误'
      };
    });
  }
}
