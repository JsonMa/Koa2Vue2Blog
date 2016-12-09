/**
 * Created by Administrator on 2016/12/9.
 */
export default class {
    constructor(mongoose, _) {
        this._ = _;
        let Schema = mongoose.Schema;
        let userSchema = new Schema({
            userName: String,
            userPass: String,
            userDes: String,
            userAvatar: String,
            createTime: {
                type: Date,
                default: Date.now
            },
            lastEditTime: {
                type: Date,
                default: Date.now
            }
        });
        this.Users = mongoose.model('Users', userSchema);
    }
    saveUser(userInfo) {
        return new Promise((resolve, reject) => {
            let user = this.Users;
            let users = new user(userInfo);
            users.save(err => {
              if (err) {
                  reject({status: false, msg: err})
              }  else {
                  resolve({status: true, msg: '新建用户成功'})
              }
            })
        })
    }
    updateUser(userId, updateInfo){
        return new Promise((resolve, reject) => {
            this.Users.update({_id: userId},updateInfo, (err, numberAffected) => {
                if (err) {
                    reject({status: false, msg: err})
                } else {
                    console.log(numberAffected);
                    resolve({status: true, msg: '用户信息修改成功'})
                }
            })
        })
    }
    findUser(userId) {
        return new Promise ((resolve, reject) => {
            this.Users.findById(userId, (err, res) => {
                if (err) {
                    reject({status: false, msg: err})
                } else {
                    resolve({status: true, msg: '用户查询成功', data: res})
                }
            })
        })
    }
}