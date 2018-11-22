// pages/neworder/neworder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    order: {},
    order_goods: {},
    order_sn: '',
    discountInfo: '折扣信息',
    first_youhui: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('user_token');
    this.setData({
      token: token
    });
    this.getOrderInfo();
    this.getCountInfo();
  },
  getCountInfo:function(){
    let that = this;
    wx.request({
      url: app.hostName + '/mobile/Api/get_zhekou_con',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res);
        that.setData({
          discountInfo: res.data
        })
      },
      fail:function(res){}
    })
  },
  getOrderInfo:function(){
    let that = this
    wx.getStorage({
      key: 'order_info',
      success:function(res){
        // console.log(res);
        that.setData({
          order: res.data.order,
          order_goods: res.data.order_goods,
          order_sn: res.data.order.order_sn,
          first_youhui: res.data.order.first_youhui
        })
      }
    })
  },
  startToPay: function(){
    let that = this
    wx.showLoading({
      title: '发起支付',
    })
    wx.request({
      url: app.hostName + '/mobile/Payment/getCode',
      data: {
        token: that.data.token.token,
        order_sn: that.data.order_sn,
        pay_code: 'weixin'
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        //调用支付
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '../orderstate/orderstate'
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败,请重新下单',
              icon: 'none',
              duration: 2000
            })
            // console.log(res);
          }
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })

    
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
  
  }
})