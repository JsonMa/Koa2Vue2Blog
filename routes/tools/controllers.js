/**
 * Created by Mahao on 2016/12/9.
 */
import * as api from './api.js';
const _ = require("underscore");

export default class {

	constructor(router, DBModule, app){
		this.router = router;
		this.DBModule = DBModule;
		this.api = api;
		this.app = app;
		this._ = _;
	}

	// 初始化
	init() {
		this.renders();
		this.actions();
	}

	// 渲染
	renders() {

	}

	//行为
	actions() {

	}
}