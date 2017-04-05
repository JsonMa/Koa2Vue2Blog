/**
 * Created by Mahao on 2016/12/9.
 */

export default class {
	constructor(mongoose) {
        const _ = require("underscore"); // underscore模块
        const moment = require('moment'); // moment模块
		this.Articles = new (require('./articles.js'))(mongoose, _, moment); // 文章模块
		this.Users = new (require('./users.js'))(mongoose, _, moment); // 用户模块
		this.News = new (require('./news.js'))(mongoose, _, moment); // 新闻模块
		this.Pumps = new (require('./pump.js'))(mongoose, _, moment); // 泵模块
		this.Seals = new (require('./seal.js'))(mongoose, _, moment); // 机械密封模块
		this.Enterprise = new (require('./enterprise.js'))(mongoose, _, moment); // 企业概况模块
		this.Honor = new (require('./honor.js'))(mongoose, _, moment); // 荣誉资质模块
	}
}