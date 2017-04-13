/**
 * Created by Mahao on 2017/3/31.
 */
export default class {
	constructor(mongoose, _, moment) {
		this._ = _;
		let Schema = mongoose.Schema;
		var newsSchema =  new Schema({
			title: String, // 新闻标题
			subTitle: String, // 新闻子标题
			content: String, // 新闻内容
			author: String, // 新闻作者
			origin: String, // 新闻来源
            newsType: {
                type: String,
                default: 'company'
            }, // 新闻类型（行业新闻/公司新闻）
            tags: String, // 新闻标签
            visits: {
				type: Number,
				default: 0
			}, // 新闻访问人数
			createTime: {
				type: Date,
				default: Date.now
			}, // 创建时间
			lastEditTime: {
				type: Date,
				default: Date.now
			}, // 修改时间
			hidden: {
				type: Boolean,
				default: false
			} // 是否隐藏
		},{
			versionKey: false, // 是否禁用字段“__v”，表示是否是通过save创建的
            timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
		});
        newsSchema.virtual('formatCreatedTime').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        newsSchema.virtual('createdTimeDetail').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        newsSchema.virtual('formatUpdateTime').get(function () {
            return moment(this.updatedAt).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        newsSchema.virtual('updateTimeDetail').get(function () {
            return moment(this.lastEditTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
		// newsSchema.set('toJSON', { getters: true, virtuals: true});
		// newsSchema.set('toObject', { getters: true, virtuals: true});
		// newsSchema.path('createTime').get(function (v) {
		// 	return new Date(v).format('yyyy-MM-dd hh:mm:ss');
		// });
		// newsSchema.path('lastEditTime').get(function (v) {
		// 	return new Date(v).format('yyyy-MM-dd hh:mm:ss');
		// });
        this.News =  mongoose.model('news', newsSchema);
	}
	saveNews(newsInfo) {
		return new Promise((resolve, reject) => {
				// var newsInfo = {
				// 	title: '伊尔流体成功进入中石化',
				// 	subTitle: '重庆伊尔流体设备制造有限公司坐落于西部唯一的年轻直辖市--重庆，是一家集生产、研发、销售为一体，并通过ISO9001认证的立卧式石油化工泵制造厂家。',
				// 	content: '重庆伊尔流体设备制造有限公司坐落于西部唯一的年轻直辖市--重庆，是一家集生产、研发、销售为一体，并通过ISO9001认证的立卧式石油化工泵制造厂家。我们不是什么都做的企业，我们只专业研发制造：各种立卧式化工流程泵、小流量高扬程皮托管泵（又名旋转喷射泵、旋壳泵）、无泄漏磁力泵以及机械密封。 公司历时5年研发了最新一代石油化工流程泵（严格执行API610“第十一版”标准），最新一代小流量高扬程皮托管泵，最新一代磁力泵以及机械密封',
				// 	author: '重庆伊尔流体',
				// 	origin: '重庆伊尔流体设备制造有限公司',
                 //    tags: '中石化'
				// };
                let News = this.News;
				let addNews = new News(newsInfo);
                    addNews.save(err => {
					if (err) {
						reject({status: false, msg: err})
					}  else {
						resolve({status: true, msg: '新闻保存成功'})
					}
				})
			}
		)
	}

    // 获取当前ID下的新闻
	findNews(newsId) {
		return new Promise((resolve, reject) => {
			this.News.find({_id: newsId}, function (err, res){

				// res 为查询到的单个文档
				if (err) {
					reject({ status: false, msg: err})
				} else {
					resolve({ status: true, msg: '查询成功', data: res})
				}
			});
		})
	}

    // 获取当前新闻的后一条记录
    findNewsNext(newsId) {
        return new Promise((resolve, reject) => {
            this.News.find({'_id' :{ "$gt" :newsId} })
				.where({hidden: false})
				.sort({_id: 1})
				.limit(1)
                .exec(function (err, res){

                    // res 为查询到的单个文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '查询成功', data: res})
                    }
                })
        })
	}

    // 获取当前新闻的前一条记录
    findNewsPrevious(newsId) {
        return new Promise((resolve, reject) => {
            this.News.find({'_id' :{ "$lt" :newsId} })
				.where({hidden: false})
				.sort({_id:-1})
				.limit(1)
                .exec(function (err, res){

                    // res 为查询到的单个文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '查询成功', data: res})
                    }
                })
		})
	}

    // 查询新闻列表
	findNewsList(params) {
		if(params) {
			let condition = {};
			if ( !params.showAll) {
				condition.hidden = false
			}
            if ( params.newsType ) {
                condition.newsType = params.newsType
            }
			return new Promise((resolve, reject) => {
                this.News.find(condition)
                    .skip((params.pageNum - 1) * params.pageSize)
                    .limit(params.pageSize)
                    .exec(function (err, res){

                        // res 为查询到的文档
                        if (err) {
                            reject({ status: false, msg: err})
                        } else {
                            resolve({ status: true, msg: '新闻列表查询成功', data: res})
                        }
                    });
			})
		}
	}

    // 查询所有的新闻数目
    findTotalNews(queryParams) {
        return new Promise((resolve, reject) => {
            if (queryParams && typeof queryParams == "object") {
                this.News.count(queryParams, function (err, count){

                    // res 为查询到的文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '新闻总条数查询成功', count: count})
                    }
                })
            } else {
                reject({ status: false, msg: '非法的查询参数'})
            }
        })
    }

    // 修改特定的新闻状态
    changeNewsStatus(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.News.findById(params._id, function (err, doc) {
                    if (err) {
                        console.log(err);
                        reject({ status: false, msg: '数据库查询错误'})
                    }
                    doc.hidden = params.hidden;
                    doc.save(err => {
                        if(err) {
                            console.log(err);
                            reject({ status: false, msg: '状态修改失败'})
                        } else {
                            resolve({ status: true, msg: '状态修改成功'})
                        }
                    });
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }

    // 修改特定的新闻
    changeNewsValue(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.News.findById(params._id, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    }
                    let date = new Date();
                    doc.lastEditTime = date;
                    doc.content = params.content; // 修改内容
                    doc.title = params.title; // 修改标题
                    doc.subTitle = params.subTitle; // 修改副标题
                    doc.newsType = params.newsType; // 修改新闻类型
                    doc.author = params.author; // 修改新闻作者
                    doc.origin = params.origin; // 修改新闻来源
                    doc.tags = params.tags; // 修改新闻标签
                    doc.save(err => {
                        if(err) {
                            reject({ status: false, msg: '状态修改失败'})
                        } else {
                            resolve({ status: true, msg: '状态修改成功'})
                        }
                    });
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }

    // 删除指定的新闻
    deleteNews(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.News.remove({_id: params._id}, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    } else {
                        resolve({ status: true, msg: '新闻删除成功'})
                    }
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }
}