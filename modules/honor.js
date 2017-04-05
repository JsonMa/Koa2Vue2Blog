/**
 * Created by Mahao on 2017/4/5.
 */
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var honorSchema =  new Schema({
            name: String, // 图片名称
            imgUrl: String, // 泵图片地址
            Summary: String, // 产品概述
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
        honorSchema.virtual('formatCreatedTime').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        honorSchema.virtual('formatUpdateTime').get(function () {
            return moment(this.updatedAt).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        this.Honor =  mongoose.model('honor', honorSchema);
    }
    saveHonor() {
        return new Promise((resolve, reject) => {
                var honorInfo = {
                    name: '生产许可证', // 图片名称
                    imgUrl: '../images/front_end/about/certifaction01.png', // 荣誉资质图片地址
                    Summary: '这是公司的生产许可证' // 图片概述
                };
                let Honor = this.Honor;
                let addHonor = new Honor(honorInfo);
                addHonor.save(err => {
                    if (err) {
                        reject({status: false, msg: err})
                    }  else {
                        resolve({status: true, msg: '荣誉资质保存成功'})
                    }
                })
            }
        )
    }

    // 获取当前ID下的新闻
    findHonor(honorId) {
        return new Promise((resolve, reject) => {
            this.Honor.find({_id: honorId}, function (err, res){

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
    findHonorNext(imageId) {
        return new Promise((resolve, reject) => {
            this.Honor.find({'_id' :{ "$gt" :imageId} })
                .limit(1)
                .sort({_id:-1})
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
    findHonorPrevious(imageId) {
        return new Promise((resolve, reject) => {
            this.Honor.find({'_id' :{ "$lt" :imageId} })
                .limit(1)
                .sort({_id:-1})
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
    findHonorList(params) {
        if(params) {
            return new Promise((resolve, reject) => {
                this.Honor.find({})
                    .skip((params.pageNum - 1) * params.pageSize)
                    .limit(params.pageSize)
                    .exec(function (err, res){

                        // res 为查询到的文档
                        if (err) {
                            reject({ status: false, msg: err})
                        } else {
                            resolve({ status: true, msg: '荣誉资质列表查询成功', data: res})
                        }
                    });
            })
        }
    }

    // 查询所有的产品数目
    findTotalHonor(queryParams) {
        return new Promise((resolve, reject) => {
            if (queryParams && typeof queryParams == "object") {
                this.Honor.count(queryParams, function (err, count){

                    // res 为查询到的文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '荣誉资质总条数查询成功', count: count})
                    }
                })
            } else {
                reject({ status: false, msg: '非法的查询参数'})
            }
        })
    }
}