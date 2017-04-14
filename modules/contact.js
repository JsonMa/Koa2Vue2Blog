/**
 * Created by Mahao on 2017/4/14.
 */
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var contactSchema =  new Schema({
            name: String, // 密封名称
            imgUrl: String, // 密封缩略图
            imgStructureUrl: String, // 密封结构图
            standards: String, // 产品执行标准
            features: String, // 产品特点
            params: {
                speed: String, // 转速
                shaft: String, // 轴径
                temperature: String, // 温度
                pressure: String // 压力
            }, // 密封使用参数
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
            timestamps: true
        });
        contactSchema.virtual('formatCreatedTime').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD');
        }); // 设置虚拟时间属性
        contactSchema.virtual('createdTimeDetail').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        this.Contact =  mongoose.model('contact', contactSchema);
    }
    saveContact(contactInfo) {
        return new Promise((resolve, reject) => {
                // var sealInfo = {
                //     name: 'H75VA4-S', // 密封名称
                //     imgUrl: '../images/front_end/product/seal/product_slider_02.jpg', // 密封缩略图
                //     imgStructureUrl: '../images/front_end/product/seal/seal_structure_01.png', // 密封结构图
                //     standards: [
                //         'API 682 / ISO 21049',
                //         'API 682 4th ed. Cat. 2/3 - 1CW-FL'
                //     ], // 产品执行标准
                //     features: '适用温度-200℃～+450℃ ;适用密封腔压力≤7.5Mpa（内压≤1.5MPa）;适用转速V≤25 m/s ;按密封腔温度和介质的腐蚀性可选用波纹管材料为 17-4PH、AM350、Inconel-718、HC-276、TA2（均系进口材料）;采用进口优质碳石墨 。', // 产品特点
                //     params: {
                //         speed: '≤3600r/min', // 转速
                //         shaft: '18~125mm', // 轴径
                //         temperature: '-40~260℃', // 温度
                //         pressure: '0~2MPa' // 压力
                //     }, // 密封使用参数
                // };
                let Contact = this.Contact;
                let addContact = new Contact(contactInfo);
                addContact.save(err => {
                    if (err) {
                        reject({status: false, msg: err})
                    }  else {
                        resolve({status: true, msg: '产品保存成功'})
                    }
                })
            }
        )
    }

    // 获取当前ID下信息
    findContact(contactId) {
        return new Promise((resolve, reject) => {
            this.Contact.find({_id: contactId}, function (err, res){

                // res 为查询到的单个文档
                if (err) {
                    reject({ status: false, msg: err})
                } else {
                    resolve({ status: true, msg: '联系信息查询成功', data: res})
                }
            });
        })
    }

    // 获取当前信息的后一条记录
    findContactNext(ContactId) {
        return new Promise((resolve, reject) => {
            this.Contact.find({'_id' :{ "$gt" :contactId} })
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

    // 获取当前信息的前一条记录
    findContactPrevious(contactId) {
        return new Promise((resolve, reject) => {
            this.Contact.find({'_id' :{ "$lt" :contactId} })
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

    // 查询信息列表
    findContactList(params) {
        if(params) {
            let condition = {};
            if ( !params.showAll) {
                condition.hidden = false
            }
            if ( params.contactType ) {
                condition.contactType = params.contactType
            }
            return new Promise((resolve, reject) => {
                this.Contact.find(condition)
                    .skip((params.pageNum - 1) * params.pageSize)
                    .limit(params.pageSize)
                    .exec(function (err, res){

                        // res 为查询到的文档
                        if (err) {
                            reject({ status: false, msg: err})
                        } else {
                            resolve({ status: true, msg: '信息列表查询成功', data: res})
                        }
                    });
            })
        }
    }

    // 查询所有的信息记录
    findTotalContact(queryParams) {
        return new Promise((resolve, reject) => {
            if (queryParams && typeof queryParams == "object") {
                this.Contact.count(queryParams, function (err, count){

                    // res 为查询到的文档
                    if (err) {
                        reject({ status: false, msg: err})
                    } else {
                        resolve({ status: true, msg: '信息总条数查询成功', count: count})
                    }
                })
            } else {
                reject({ status: false, msg: '非法的查询参数'})
            }
        })
    }

    // 修改特定的新闻状态
    changeContactStatus(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Contact.findById(params._id, function (err, doc) {
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

    // 删除指定的信息
    deleteContact(params) {
        return new Promise((resolve, reject) => {
            if (params && typeof params == "object") {
                this.Contact.remove({_id: params._id}, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '数据库查询错误'})
                    } else {
                        resolve({ status: true, msg: '信息删除成功'})
                    }
                })
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }

    // 修改指定的信息
    changeContactValue(id, contactInfo) {
        return new Promise((resolve, reject) => {
            if (id && contactInfo && typeof contactInfo == "object") {
                this.Contact.findByIdAndUpdate(id, contactInfo, function (err, doc) {
                    if (err) {
                        reject({ status: false, msg: '信息修改失败'})
                    } else {
                        resolve({ status: true, msg: '信息修改成功'})
                    }
                });
            } else {
                reject({ status: false, msg: '参数错误'})
            }
        })
    }
}