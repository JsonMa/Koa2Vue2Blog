/**
 * Created by Mahao on 2017/4/1.
 */
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var pumpSchema =  new Schema({
            name: String, // 泵名称
            safeStage: String, // 安全等级
            imgUrl: String, // 泵图片地址
            params: {
                structure: String,
                standard: String,
                flow: String,
                high: String,
                temperature: String,
                pressure: String
            }, // 泵参数
            stage: {
                safe: String,
                manufacture: String,
                warranty: String,
                antiSeismic: String,
                clean: String
            }, // 设备分级
            pumpType: {
                type: String,
                default: 'company'
            }, // 泵类型
            area: String, // 使用范围
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
        pumpSchema.virtual('formatCreatedTime').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        pumpSchema.virtual('createdTimeDetail').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        pumpSchema.virtual('formatUpdateTime').get(function () {
            return moment(this.updatedAt).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        pumpSchema.virtual('updateTimeDetail').get(function () {
            return moment(this.lastEditTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        this.Pump =  mongoose.model('pump', pumpSchema);
    }
    savePump() {
        return new Promise((resolve, reject) => {
                var pumpInfo = {
                    name: '余热排出泵', // 泵名称
                    safeStage: '核安全二级', // 安全等级
                    imgUrl: '../images/front_end/product/pump_pitot_01.jpg', // 泵图片地址
                    params: {
                        structure: '立式结构',
                        standard: 'RCC-M《压水堆核岛机械设备设计和建造规则》',
                        flow: '120m3/h，910m3/h，1475m3/h',
                        high: '95m，77m，≈43m',
                        temperature: '200℃',
                        pressure: '10.0 MPa'
                    }, // 泵参数
                    stage: {
                        safe: '2',
                        manufacture: '2',
                        warranty: 'Q1',
                        antiSeismic: '1A',
                        clean: 'A22'
                    }, // 设备分级
                    area: '用于600MWe, 900MWe, 1000MWe 压水堆核电站余热排出系统，在反应堆停运过程中，余热排出泵使反应堆冷却剂在RRA热交换器和反应堆压力容器之间循环以保证电厂进入冷停堆状态。', // 使用范围
                    Summary: '核安全二级余热排出泵是按照RCC-M《压水堆核岛机械设备设计和建造规则》，结合我公司多年积累的泵制造经验设计制造的。该泵为卧式单级单吸悬臂式结构。可以满足冷热冲击和杂质运行等特殊工况。并满足地震下完整性和可运行性。', // 产品概述
                };
                let Pump = this.Pump;
                let addPump = new Pump(pumpInfo);
                    addPump.save(err => {
                    if (err) {
                        reject({status: false, msg: err})
                    }  else {
                        resolve({status: true, msg: '产品保存成功'})
                    }
                })
            }
        )
    }

    // 获取当前ID下的新闻
    findPump(pumpId) {
        return new Promise((resolve, reject) => {
            this.Pump.find({_id: pumpId}, function (err, res){

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
    findPumpNext(pumpId) {
        return new Promise((resolve, reject) => {
            this.Pump.find({'_id' :{ "$gt" :pumpId} })
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
    findPumpPrevious(pumpId) {
        return new Promise((resolve, reject) => {
            this.Pump.find({'_id' :{ "$lt" :pumpId} })
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
    findPumpList(params) {
        let condition = {};
        if ( !params.showAll) {
            condition.hidden = false
        }
        if ( params.newsType ) {
            condition.pumpType = params.pumpType
        }
        if(params) {
            return new Promise((resolve, reject) => {
                this.Pump.find(condition)
                    .skip((params.pageNum - 1) * params.pageSize)
                    .limit(params.pageSize)
                    .exec(function (err, res){

                        // res 为查询到的文档
                        if (err) {
                            reject({ status: false, msg: err})
                        } else {
                            resolve({ status: true, msg: '产品列表查询成功', data: res})
                        }
                    });
            })
        }
    }

    // 查询所有的产品数目
    findTotalPump(queryParams) {
        return new Promise((resolve, reject) => {
            if (queryParams && typeof queryParams == "object") {
                this.Pump.count(queryParams, function (err, count){

                    // res 为查询到的文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '产品总条数查询成功', count: count})
                    }
                })
            } else {
                reject({ status: false, msg: '非法的查询参数'})
            }
        })
    }

    // 修改特定的新闻状态
    changePumpStatus(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Pump.findById(params._id, function (err, doc) {
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
}