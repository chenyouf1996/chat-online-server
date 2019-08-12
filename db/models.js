/*
包含n个能操作mongodb数据库集合的model的模块
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 定义对应特定集合的Model
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
3. 向外暴露获取Model的方法
 */
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/chatOnline_serve')
const conn = mongoose.connection
conn.on('connected', function () {
  console.log('数据库连接成功!')
})

//定义users集合文档结构
const userSchema = mongoose.Schema({
  username: { type: String, require: true },//用户名
  password: { type: String, require: true },//密码
  email:{type:String} //邮箱
})

const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel