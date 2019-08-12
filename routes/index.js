var express = require('express');
var router = express.Router();

const { UserModel } = require('../db/models')

//users为当前登录的用户数组
let users = []
//登录路由
router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  UserModel.findOne({ username, password }, { __v: 0, password: 0, email: 0 }, function (err, userDoc) {
    if (userDoc) {
      //登录后user中添加已登录用户名 没有则添加有则返回已登录
      if (users.includes(username)) {
        res.send({ code: 2, msg: '该用户已登录' })
        return
      } else {
        users.push(username)
      }
      console.log(users)
      //返回cookie userid为数据库中的_id cookie实现自动登录时长为24小时
      res.cookie('userid', userDoc._id, { maxAge: 1000 * 60 * 60 * 24 })
      res.send({ code: 0, msg: '登录成功', data: userDoc })
      return
    }
    res.send({ code: 1, msg: '用户名或密码错误' })
  })
})

//注册路由
router.post('/register', function (req, res, next) {
  const { username, password, email } = req.body
  UserModel.findOne({ username }, function (err, userDoc) {
    if (userDoc) {
      res.send({ code: 1, msg: '用户名已存在' })
      return
    }
    new UserModel({ username, password, email }).save(function (err, user) {
      let data = { username, email, _id: user._id }
      res.send({ code: 0, msg: '注册成功', data })
    })
  })
})

//获取用户名路由
router.get('/getUser', function (req, res, next) {
  UserModel.findById(req.cookies.userid, function (err, userDoc) {
    if (userDoc) {
      res.send({ code: 0, data: userDoc })
      return
    }
    res.send({ code: 1, msg: '未找到该用户' })
  })
})

//自动登录路由
router.get('/autoLogin', function (req, res, next) {
  let userid = req.cookies.userid
  UserModel.findById(userid, function (err, userDoc) {
    //根据cookie查找用户名 判断已登录的用户数组是否有该用户没有则自动登录 有则返回已登录
    console.log(users)
    if (users.includes(userDoc.username)) {
      res.send({ code: 2, msg: '用户已登录' })
      return
    }
    users.push(userDoc.username)
    res.send({ code: 0, msg: '登录成功' })
  })
})

module.exports = { router, users };
