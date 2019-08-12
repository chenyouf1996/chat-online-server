
/**
*监听客户端连接
*io是我们定义的服务端的socket
*回调函数里面的socket是本次连接的客户端socket
*io与socket是一对多的关系
*/
let users=require('../routes/index').users
// let count=0
module.exports = function (serve) {
  //导入socket.io传入serve服务器对象 获得服务器io对象(定义的服务器socket)
  let io = require('socket.io')(serve)
  /*所有的监听on，与发送emit都得写在连接里面，包括断开连接*/
  io.on('connection', function (socket) {
    console.log('有客户端连接', '当前人数' + io.engine.clientsCount)
    // count++
    //客户端登录的监听
    socket.on('login', function (user) {
      io.sockets.emit('showUser', { user, count: io.engine.clientsCount })
      //退出连接的监听
      socket.on('disconnect', function () {
        //退出删除users中当前退出人员的用户名
        // users=users.filter(item=>item!==user)
        users.splice(users.indexOf(user),1)
        console.log('有客户端退出连接', '当前人数' + io.engine.clientsCount)
        io.sockets.emit('showOut', { user, count: io.engine.clientsCount+'' })
        console.log(users)
      })
    })
    //服务端接收消息的监听
    socket.on('sendMessage', function (data) {
      console.log(data.username + '说' + data.message)
      io.sockets.emit('receiveMessage', data)
    })
  })
}