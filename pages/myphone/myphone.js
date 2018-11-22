// pages/myphone/myphone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    getCode: false,
    reqSetMobile: '/mobile/User/setMobile',
    reqGetCode: '/index.php?m=Home&c=Api&a=send_validate_code&scene=6&type=mobile&mobile=',
    reqGetMobile: '/mobile/User/getMobileMsg',
    code:"",
    phoneValue: "",
    real_name:"",
    school_name: "",
    inputTips: "",
    tipsShow: true,
    countDown: false,
    waitSec: 30
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let token = wx.getStorageSync('user_token').token || "";
    that.setData({
      token: token
    })
    if (token != "") {
      that.getMobile();
    }
  },
  getMobile:function(){
    let that = this
    wx.request({
      url: app.hostName + that.data.reqGetMobile,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: that.data.token
      },
      dataType: 'json',
      success: function (res) {
        // console.log(res);
        if (res.data.mobile!=""){
          that.setData({
            phoneValue: res.data.mobile,
            real_name: res.data.real_name,
            school_name: res.data.school_name,
            getCode: true
          })
        }
      }
    })
  },
  checkCode: function(e){
    let _code = e.detail.value;

    if (_code.length === 11){
      this.setData({
        getCode: true,
        phoneValue: _code
      })
    }else{
      this.setData({
        getCode: false,
        phoneValue: _code
      })
    }
  },
  inputCode:function(e){
    let _getCode = e.detail.value;
    this.setData({
      code: _getCode
    })
  },
  inputName: function (e) {
    let _real_name = e.detail.value;
    this.setData({
      real_name: _real_name
    })
  },
  inputSchoolName:function(e){
    let _school_name = e.detail.value;
    this.setData({
      school_name: _school_name
    })
  },
  confirm_binding: function(){
    let that = this;
    let subNumber = that.data.phoneValue;
    let subCode = that.data.code;

    if (subNumber ===""){
      that.setData({
        inputTips: "请输入正确的手机号码",
        tipsShow: false
      })
    } else if (subCode ===""){
      that.setData({
        inputTips: "请输入正确的验证码",
        tipsShow: false
      })
    }else{
      that.setData({
        inputTips: "",
        tipsShow: true
      })

      wx.request({
        url: app.hostName + that.data.reqSetMobile,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          token: that.data.token,
          mobile_code: that.data.code,
          mobile: that.data.phoneValue,
          real_name: that.data.real_name,
          school_name: that.data.school_name,
        },
        dataType: 'json',
        success: function (res) {
          // console.log(res);
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '../index/index'
            })
          },2000)
        }
      })
    }
  },

  getCode: function () {
    let that = this
    let phoneNumber = that.data.phoneValue;
    that.setData({
      countDown: true,
      waitSec: 30
    })

    wx.request({
      url: app.hostName + that.data.reqGetCode + phoneNumber,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          countDown: true,
          waitSec: 30
        })

        that.timeDown();
      }
    })
  },

  timeDown: function(){
    let that = this
    let sec = that.data.waitSec;
    let time = setInterval(function(){
      sec--;
      that.setData({
        waitSec: sec
      })
      if (that.data.waitSec == 0) {
        clearInterval(time)
        that.setData({
          countDown: false,
          waitSec: 30
        })
      }
    },1000)
  },

  getPhone: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { }
      })
      // wx.request({
      //   url: '传输加密参数到后台,然后传输加密后的手机号码',
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/json'
      //   },
      //   data: {
      //     iv: e.detail.iv,
      //     encryptedData: e.detail.encryptedData
      //   },
      //   dataType: 'json',
      //   success: function (res) {
      //     console.log(res);
      //   }
      // })
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