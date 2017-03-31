/**
 * Created by Mahao on 2016/12/9.
 */

export default class {
	constructor(mongoose) {
        const _ = require("underscore"); // underscore模块
        const moment = require('moment'); // moment模块
		this.Articles = new (require('./articles.js'))(mongoose, _, moment);
		this.Users = new (require('./users.js'))(mongoose, _, moment);
		this.News = new (require('./news.js'))(mongoose, _, moment);
	}
}