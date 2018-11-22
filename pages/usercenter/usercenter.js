// pages/usercenter/usercenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loginUrl: '/mobile/MobileBase/wxAppLogin',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sessionFailed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              // console.log(res.userInfo);
              app.globalData.userInfo = res.userInfo;
              that.login(app.globalData.userInfo);
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  nologin(){
    wx.showToast({
      title: '请先登录授权',
      duration: 1500,
      mask:true,
      icon: 'none'
    })
  },

  bindGetUserInfo: function (e) {
    let that = this
    app.globalData.userInfo = e.detail.userInfo;
    that.setData({
      userInfo: e.detail.userInfo
    })
    //获取用户信息
    // that.login(app.globalData.userInfo);
    that.login(app.globalData.userInfo);
  },
  login: function (info = {}) {
    let that = this
      wx.login({
        success: res => {
          if (res.code) {
            let code = res.code;
            // console.log(code);
            wx.showLoading({
              title: '正在登录',
            })
            wx.request({
              url: app.hostName + app.loginUrl,
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              data: {
                code: code,
                userInfo: info
              },
              dataType: 'json',
              success: function (res) {
                // console.log(res);
                wx.setStorage({
                  key: "user_token",
                  data: {
                    token: res.data.token,
                    openid: res.data.result.openid
                  },
                  success: function () {
                    that.setData({
                      sessionFailed: false
                    })
                    wx.hideLoading()
                    wx.showToast({
                      title: '登录成功',
                      icon: 'success',
                      duration: 2000,
                      mask: true
                    })
                  }
                })
              }
            })
          }
        }
      })
    //重新登录
  },
  loginCheckSession: function () {
    let that = this;
    let token = wx.getStorageSync('user_token');
    if (token != "") {
      wx.checkSession({
        success: function (res) {
          // console.log('未过期')
          that.setData({
            sessionFailed: false
          })
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail: function () {
          // console.log('过期')
          that.setData({
            sessionFailed: true
          })
          // session_key 已经失效，需要重新执行登录流程
        }
      })
    }else{
      that.setData({
        sessionFailed: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.getSetting({
      success: function (res) {
        // console.log(res);
        that.loginCheckSession();
        // if (res.authSetting['scope.userInfo']) {
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        // }else{
        //   that.loginCheckSession();
        // }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})