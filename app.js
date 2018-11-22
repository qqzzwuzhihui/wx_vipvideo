//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  sessionFailed: false,
  sessionInfo:{
    unionid:''
  },
  loginUrl: '/mobile/MobileBase/wxAppLogin',
  login: function(info){
    //info是获取的用户资料
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          let code = res.code;
          console.log(code);
          wx.request({
            url: that.hostName + that.loginUrl,
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              code: code,
              userInfo: info
            },
            dataType: 'json',
            success: function (res) {
              console.log(res);
            }
          })
        }
      }
    })
        //重新登录
  },
  loginCheckSession: function (info={}) {
    let that = this;
    wx.checkSession({
      success: function () {
        console.log('未过期')
        that.sessionFailed = false;
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        console.log('过期')
        that.sessionFailed = true;
        that.login(info);
        // session_key 已经失效，需要重新执行登录流程
      }
    })
  },

  globalData: {
    userInfo: null
  },
  hostName: "https://yishushengyikao.com.cn"
})