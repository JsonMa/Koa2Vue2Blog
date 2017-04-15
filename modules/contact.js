/**
 * Created by Mahao on 2017/4/14.
 */
export default class {
    constructor(mongoose, _, moment) {
        this._ = _;
        let Schema = mongoose.Schema;
        var contactSchema =  new Schema({
            name: String, // 留言人名称
            phone: String, // 留言人电话
            email: String, // 电子邮件
            content: String, // 留言内容
            createTime: {
                type: Date,
                default: Date.now
            }, // 创建时间
            lastEditTime: {
                type: Date,
                default: Date.now
            } // 修改时间
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
        contactSchema.virtual('createdTimeDetail').get(function () {
            return moment(this.createTime).format('YYYY-MM-DD HH:MM:SS');
        }); // 设置虚拟时间属性
        this.Contact =  mongoose.model('contact', contactSchema);
    }
    saveContact(contactInfo) {
        return new Promise((resolve, reject) => {
                // var contactInfo = {
                //     name: '周强', // 留言人名称
                //     phone: '13896120332', // 留言人电话
                //     email: 'mahao-0321@hotmail.com', // 电子邮件
                //     content: '这是什么啊啊啊啊啊啊啊', // 留言内容
                // };
                let Contact = this.Contact;
                let addContact = new Contact(contactInfo);
                addContact.save(err => {
                    if (err) {
                        reject({status: false, msg: err})
                    }  else {
                        resolve({status: true, msg: '留言保存成功'})
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