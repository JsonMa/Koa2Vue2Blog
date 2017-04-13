/**
 * Created by Mahao on 2017/4/5.
 */
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var enterpriseSchema =  new Schema({
            name: String, // 图片名称
            imgUrl: String, // 图片地址
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
        enterpriseSchema.virtual('createdTimeDetail').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        enterpriseSchema.virtual('formatUpdateTime').get(function () {
            return moment(this.updatedAt).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        enterpriseSchema.virtual('updateTimeDetail').get(function () {
            return moment(this.lastEditTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        this.Enterprise =  mongoose.model('enterprise', enterpriseSchema);
    }
    saveEnterprise(enterpriseInfo) {
        return new Promise((resolve, reject) => {
                // var enterpriseInfo = {
                //     name: '公司餐厅', // 图片名称
                //     imgUrl: '../images/front_end/about/enterprise_image/enterprise_01.jpg', // 企业风采图片地址
                //     Summary: '结合我公司多年积累的泵制造经验设计制造的。该泵为卧式单级单吸悬臂式结构。可以满足冷热冲击和杂质运行等特殊工况。并满足地震下完整性和可运行性。' // 图片概述
                // };
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

    // 获取当前ID下的企业风采
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

    // 获取当前企业风采的后一条记录
    findEnterpriseNext(imageId) {
        return new Promise((resolve, reject) => {
            this.Enterprise.find({'_id' :{ "$gt" :imageId} })
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

    // 获取当前企业风采的前一条记录
    findEnterprisePrevious(imageId) {
        return new Promise((resolve, reject) => {
            this.Enterprise.find({'_id' :{ "$lt" :imageId} })
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

    // 查询企业风采列表
    findEnterpriseList(params) {
        if(params) {
            return new Promise((resolve, reject) => {
                let condition = params.showAll == true ? {}: {hidden: false};
                this.Enterprise.find(condition)
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

    // 查询所有的企业风采数目
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

    // 修改特定企业风采状态
    changeEnterpriseStatus(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Enterprise.findById(params._id, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    }
                    doc.hidden = params.hidden;
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

    // 修改特定的荣誉资质
    changeEnterpriseValue(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Enterprise.findById(params._id, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    }
                    let date = new Date();
                    let imgUrlString = doc.imgUrl;
                    let isSame = doc.imgUrl == params.imgUrl? true: false;
                    let oldPath = imgUrlString.replace('..', 'public');
                    doc.lastEditTime = date;
                    doc.name = params.name; // 设置名称
                    doc.imgUrl = params.imgUrl; // 设置图片地址
                    doc.Summary = params.Summary; // 设置图片简介
                    doc.save(err => {
                        if(err) {
                            reject({ status: false, msg: '状态修改失败'})
                        } else {
                            if (!isSame) {
                                try
                                {
                                    fs.unlink(oldPath, function (err) {
                                        if(err){
                                            console.log(err);
                                            return;
                                        }
                                    });
                                }
                                catch(err)
                                {
                                    console.log('旧图片删除失败');
                                }
                            }
                            resolve({ status: true, msg: '状态修改成功'})
                        }
                    });
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }
    
    // 删除特定的企业形象
    deleteEnterprise(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Enterprise.remove({_id: params._id}, function (err, doc) {
                    if (err) {
                        console.log(err);
                        reject({ status: false, msg: '数据库查询错误'})
                    } else {
                        resolve({ status: true, msg: '企业形象删除成功'})
                    }
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }
}