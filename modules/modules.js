/**
 * Created by Mahao on 2016/12/9.
 */
var _ = require("underscore");

export default class {
	constructor(mongoose) {
		this.Articles = new (require('./articles.js'))(mongoose, _)
		this.Users = new (require('./users.js'))(mongoose, _)
		this.News = new (require('./news.js'))(mongoose, _)
	}
}