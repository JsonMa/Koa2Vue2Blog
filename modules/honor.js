/**
 * Created by Mahao on 2017/4/5.
 */
import fs from 'fs';
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var honorSchema =  new Schema({
            name: String, // 图片名称
            imgUrl: String, // 泵图片地址
            Summary: String, // 产品概述
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
        honorSchema.virtual('createdTimeDetail').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        honorSchema.virtual('formatUpdateTime').get(function () {
            return moment(this.lastEditTime).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        honorSchema.virtual('updateTimeDetail').get(function () {
            return moment(this.lastEditTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        this.Honor =  mongoose.model('honor', honorSchema);
    }
    saveHonor(honorInfo) {
        return new Promise((resolve, reject) => {
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

    // 获取当前ID下荣誉资质
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

    // 获取当前荣誉资质的后一条记录
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

    // 获取当前荣誉资质的前一条记录
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

    // 查询荣誉资质列表
    findHonorList(params) {
        if(params) {
            let condition = params.showAll == true ? {}: {hidden: false};
            return new Promise((resolve, reject) => {
                this.Honor.find(condition)
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

    // 查询所有的荣誉资质数目
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

    // 修改特定的荣誉资质状态
    changeHonrStatus(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Honor.findById(params._id, function (err, doc) {
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
    changeHonrValue(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Honor.findById(params._id, function (err, doc) {
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
                            console.log(oldPath);
                            if (!isSame) {
                                try
                                {
                                    fs.unlink(oldPath);
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

    // 删除特定的荣誉资质状态
    deleteHonrStatus(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Honor.remove({_id: params._id}, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    } else {
                        resolve({ status: true, msg: '荣誉资质删除成功'})
                    }
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }
}