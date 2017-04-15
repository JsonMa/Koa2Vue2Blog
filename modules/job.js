/**
 * Created by Administrator on 2017/4/15.
 */
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var jobSchema =  new Schema({
            jobName: String, // 工作名称
            jobDescribe: String, // 工作描述
            jobDemand: String, // 工作要求
            author: {
                type: String,
                default: '伊尔流体设备人事部'
            }, // 工作类型
            jobType: {
                type: String,
                default: 'other'
            }, // 工作类型
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
            timestamps: false
        });
        jobSchema.virtual('formatCreatedTime').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        jobSchema.virtual('createdTimeDetail').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        jobSchema.virtual('formatUpdateTime').get(function () {
            return moment(this.updatedAt).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        jobSchema.virtual('updateTimeDetail').get(function () {
            return moment(this.lastEditTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        this.Job =  mongoose.model('job', jobSchema);
    }
    saveJob(jobInfo) {
        return new Promise((resolve, reject) => {
                var jobInfo = {
                    jobName: '高级Android开发工程师', // 工作名称
                    jobDescribe: '负责虎嗅PC端、H5和移动端（含前端和后端）的产品设计', // 工作描述
                    jobDemand: '具备较强的数据分析、竞品分析、逻辑分析等能力' // 工作要求
                };
                let Job = this.Job;
                let addJob = new Job(jobInfo);
                addJob.save(err => {
                    if (err) {
                        reject({status: false, msg: err})
                    }  else {
                        resolve({status: true, msg: '工作保存成功'})
                    }
                })
            }
        )
    }

    // 获取当前ID下的工作
    findJob(jobId) {
        return new Promise((resolve, reject) => {
            this.Job.find({_id: jobId}, function (err, res){

                // res 为查询到的单个文档
                if (err) {
                    reject({ status: false, msg: err})
                } else {
                    resolve({ status: true, msg: '查询成功', data: res})
                }
            });
        })
    }

    // 获取当前工作的后一条记录
    findJobNext(jobId) {
        return new Promise((resolve, reject) => {
            this.News.find({'_id' :{ "$gt" :jobId} })
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

    // 获取当前工作的前一条记录
    findJobPrevious(jobId) {
        return new Promise((resolve, reject) => {
            this.News.find({'_id' :{ "$lt" :jobId} })
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

    // 查询工作列表
    findJobList(params) {
        if(params) {
            let condition = {};
            if ( !params.showAll) {
                condition.hidden = false
            }
            if ( params.jobType ) {
                condition.jobType = params.jobType
            }
            return new Promise((resolve, reject) => {
                this.Job.find(condition)
                    .skip((params.pageNum - 1) * params.pageSize)
                    .limit(params.pageSize)
                    .exec(function (err, res){

                        // res 为查询到的文档
                        if (err) {
                            reject({ status: false, msg: err})
                        } else {
                            resolve({ status: true, msg: '工作列表查询成功', data: res})
                        }
                    });
            })
        }
    }

    // 查询所有的工作数目
    findTotalJob(queryParams) {
        return new Promise((resolve, reject) => {
            if (queryParams && typeof queryParams == "object") {
                this.Job.count(queryParams, function (err, count){

                    // res 为查询到的文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '工作总条数查询成功', count: count})
                    }
                })
            } else {
                reject({ status: false, msg: '非法的查询参数'})
            }
        })
    }

    // 修改特定的工作状态
    changeJobStatus(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Job.findById(params._id, function (err, doc) {
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

    // 修改特定的工作
    changeJobValue(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Job.findById(params._id, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    }
                    let date = new Date();
                    doc.lastEditTime = date;
                    doc.content = params.content; // 修改内容
                    doc.title = params.title; // 修改标题
                    doc.subTitle = params.subTitle; // 修改副标题
                    doc.jobType = params.jobType; // 修改工作类型
                    doc.author = params.author; // 修改工作作者
                    doc.origin = params.origin; // 修改工作来源
                    doc.tags = params.tags; // 修改工作标签
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

    // 删除指定的工作
    deleteJob(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Job.remove({_id: params._id}, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    } else {
                        resolve({ status: true, msg: '工作删除成功'})
                    }
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }
}