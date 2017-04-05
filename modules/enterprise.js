/**
 * Created by Mahao on 2017/4/5.
 */
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var enterpriseSchema =  new Schema({
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
        enterpriseSchema.virtual('formatCreatedTime').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        enterpriseSchema.virtual('formatUpdateTime').get(function () {
            return moment(this.updatedAt).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        this.Enterprise =  mongoose.model('enterprise', enterpriseSchema);
    }
    saveEnterprise() {
        return new Promise((resolve, reject) => {
                var enterpriseInfo = {
                    name: '公司餐厅', // 图片名称
                    imgUrl: '../images/front_end/about/enterprise_image/enterprise_01.jpg', // 企业风采图片地址
                    Summary: '结合我公司多年积累的泵制造经验设计制造的。该泵为卧式单级单吸悬臂式结构。可以满足冷热冲击和杂质运行等特殊工况。并满足地震下完整性和可运行性。' // 图片概述
                };
                let Enterprise = this.Enterprise;
                let addEnterprise = new Enterprise(enterpriseInfo);
                addEnterprise.save(err => {
                    if (err) {
                        reject({status: false, msg: err})
                    }  else {
                        resolve({status: true, msg: '企业风采保存成功'})
                    }
                })
            }
        )
    }

    // 获取当前ID下的新闻
    findEnterprise(imageId) {
        return new Promise((resolve, reject) => {
            this.Enterprise.find({_id: imageId}, function (err, res){

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
    findEnterpriseNext(imageId) {
        return new Promise((resolve, reject) => {
            this.Enterprise.find({'_id' :{ "$gt" :imageId} })
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
    findEnterprisePrevious(imageId) {
        return new Promise((resolve, reject) => {
            this.Enterprise.find({'_id' :{ "$lt" :imageId} })
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
    findEnterpriseList(params) {
        if(params) {
            return new Promise((resolve, reject) => {
                this.Enterprise.find({})
                    .skip((params.pageNum - 1) * params.pageSize)
                    .limit(params.pageSize)
                    .exec(function (err, res){

                        // res 为查询到的文档
                        if (err) {
                            reject({ status: false, msg: err})
                        } else {
                            resolve({ status: true, msg: '企业风采列表查询成功', data: res})
                        }
                    });
            })
        }
    }

    // 查询所有的产品数目
    findTotalEnterprise(queryParams) {
        return new Promise((resolve, reject) => {
            if (queryParams && typeof queryParams == "object") {
                this.Enterprise.count(queryParams, function (err, count){

                    // res 为查询到的文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '企业风采总条数查询成功', count: count})
                    }
                })
            } else {
                reject({ status: false, msg: '非法的查询参数'})
            }
        })
    }
}