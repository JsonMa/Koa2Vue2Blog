/**
 * Created by Mahao on 2016/12/9.
 */

const crypto = require('crypto'); // 加密组件
const _ = require("underscore");

// 密码加密
export function encryption(str){

    var hasher=crypto.createHash("md5");   // 创建一个用户加密的对象

    hasher.update(str);                     // str为需要加密的字符串，连续调用多次update是将多个字符串拼接

    var ret = hasher.digest('hex');         // 返回加密后的字符串，每个对象只能调用一次digest方法

    console.log('加密测试 ： ',str, ret);

    return ret;
}

// 登录验证
export function  isLogin(){
    return async (ctx, next) => {
        if(_.isEmpty(ctx.session.user)){
            console.log('未登录');
            if(ctx.request.method.toLowerCase() == 'get'){
                ctx.redirect('/login' + '?from=' + ctx.request.url);
            }
            else{
                ctx.body = {
                    status: 'notLogin',
                    msg: '未登录，请先登录'
                }
            }

        }
        else{
            console.log('已登录');
            await next();
        }
    }

}

// 权限验证user: 当前用户， permission: 需要用到的权限可以是数组； return： true/false
export function  hasPermission(user, permission){
    if(_.isString(permission)){
        return _.contains(user.permission, permission)
    }
    else if (_.isArray(permission)){
        var intersection = _.intersection(user.permission, permission);
        console.log('intersection : ', intersection);
        if(intersection && intersection.length > 0){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false ;
    }
}


// mongoose 的_id 转为 string
export function  IDToString(data){
    if(_.isArray(data)){
        var list = [];
        _.each(data, function(num){
            num = num.toObject();
            if(_.isObject(num)){
                num._id = num._id.toString();
                list.push(num);
            }
        });
        if(_.isEmpty(list)){
            return data;
        }
        else{
            return list;
        }

    }
    else{
        if(_.isObject(data)){
            data = data.toObject();
            data._id = data._id.toString();
        }
        return data;
    }
}

// 热门推荐
export function hotRecommend(db, params) {
    return new Promise ((resolve, reject) => {
        console.log('in');
        this.DBModule = db;
        let response = this.DBModule.News.findNewsList(params); // 当前查询条件下的新闻数据
        response.then(function (result) {
            if (result.status) {
                resolve({status: true, data: result.data})
            }
        }).catch(
            function (error) {
                // console.log(error);
                reject({status: false})
            }
        );
    })
    // return async(ctx, next) => {
    //     if(_.isEmpty(ctx.session.recommend)){
    //         console.log('未包含热门推荐');
    //         let queryParams = {
    //             pageNum: 1, // 当前页数
    //             pageSize: 5, // 每页显示数量
    //             newsType: 'company' // 新闻类型
    //         };
    //         let recommend = await this.DBModule.News.findNewsList(queryParams);
    //         console.log(recommend);
    //         ctx.session.recommend = recommend;
    //     } else{
    //         console.log('已包含热门推荐');
    //         await next();
    //     }
    // }
}