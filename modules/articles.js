/**
 * Created by Mahao on 2016/12/9.
 */
export default class {
	constructor(mongoose, _) {
		this._ = _;
		let Schema = mongoose.Schema;
		var articleSchema =  new Schema({
			title: String,
			visits: {
				type: Number,
				default: 0
			},
			tags: [{
				type: Schema.Types.ObjectId,
				ref: 'tag'
			}],
			createTime: {
				type: Date,
				default: Date.now
			},
			lastEditTime: {
				type: Date,
				default: Date.now
			},
			hidden: Boolean,
			excerpt: String,
			content: String,
			comments: [{
				type: Schema.Types.ObjectId,
				ref: 'comment'
			}]
		},{
			versionKey: false,
			skipVersioning: { tags: true }
		});
		articleSchema.set('toJSON', { getters: true, virtuals: true});
		articleSchema.set('toObject', { getters: true, virtuals: true});
		articleSchema.path('createTime').get(function (v) {
			return new Date(v).format('yyyy-MM-dd hh:mm:ss');
		});
		articleSchema.path('lastEditTime').get(function (v) {
			return new Date(v).format('yyyy-MM-dd hh:mm:ss');
		});
		this.Articles =  mongoose.model('article', articleSchema);
	}
	saveArticles() {
		return new Promise((resolve, reject) => {

			}
		)
	}
	updateArticles() {
		return new Promise((resolve, reject) => {

			}
		)
	}
	findArticles(artId) {
		return new Promise((resolve, reject) => {
			this.Articles.findById(artId, function (err, res){
				
				// res 为查询到的单个文档
				if (err) {
					reject({ status: false, msg: err})
				} else {
					resolve({ status: true, msg: '查询成功', data: res})
				}
			});
		})
	}
}