/**
 * Created by Mahao on 2017/3/31.
 */
export default class {
	constructor(mongoose, _) {
		this._ = _;
		let Schema = mongoose.Schema;
		var newsSchema =  new Schema({
			title: String, // 新闻标题
			subTitle: String, // 新闻子标题
			content: String, // 新闻内容
			author: String, // 新闻作者
			visits: {
				type: Number,
				default: 0
			}, // 新闻访问人数
			tags: [{
				type: Schema.Types.ObjectId,
				ref: 'tag'
			}], // 新闻标签
			createTime: {
				type: Date,
				default: Date.now
			}, // 创建时间
			lastEditTime: {
				type: Date,
				default: Date.now
			}, // 修改时间
			hidden: Boolean, // 是否隐藏
			comments: [{
				type: Schema.Types.ObjectId,
				ref: 'comment'
			}] // 推荐
		},{
			versionKey: false, // 是否禁用字段“__v”，表示是否是通过save创建的
			skipVersioning: { tags: true }
		});
		newsSchema.set('toJSON', { getters: true, virtuals: true});
		newsSchema.set('toObject', { getters: true, virtuals: true});
		newsSchema.path('createTime').get(function (v) {
			return new Date(v).format('yyyy-MM-dd hh:mm:ss');
		});
		newsSchema.path('lastEditTime').get(function (v) {
			return new Date(v).format('yyyy-MM-dd hh:mm:ss');
		});
		this.News =  mongoose.model('news', newsSchema);
	}
	saveNews() {
		return new Promise((resolve, reject) => {

			}
		)
	}
	findNews(newsId) {
		return new Promise((resolve, reject) => {
			this.News.findById(newsId, function (err, res){

				// res 为查询到的单个文档
				if (err) {
					reject({ status: false, msg: err})
				} else {
					resolve({ status: true, msg: '查询成功', data: res})
				}
			});
		})
	}
	findNewsList(params) {
		if(params) {
			return new Promise((resolve, reject) => {
				this.News.find(params, function (err, res){

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
}