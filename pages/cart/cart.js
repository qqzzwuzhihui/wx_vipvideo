// pages/cart/cart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostName: app.hostName,
    noProduct: true,
    reqCartList: "/mobile/Cart/index",
    reqDeleteItem: "/mobile/Cart/delete",
    reqAddOrder: "/mobile/Cart/cart_add_order",
    cartArray: [],
    totalPrice:'',
    canBuy: 0,
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('user_token').token || "";
    this.setData({
      token: token
    })
    
  },
  loadCartList: function(){
    //读取购物车列表
    let that = this
    wx.showLoading({
      title: '正在读取购物车列表',
    })
    wx.request({
      url: app.hostName + that.data.reqCartList,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        cart_ids: that.data.videoId,
        token: that.data.token,
      },
      dataType: 'json',
      success: function (d) {
        wx.hideLoading();
        // console.log(d);
        if (d.statusCode == 200) {
          let list = d.data.cartList
          let total = 0;
          
          that.setData({
            cartArray: d.data.cartList
          })
          that.checkCart();
        }
      }
    })
  },
  deleteItems: function(e){
    //删除购物车商品
    let that = this;
    let delItem = e.currentTarget.dataset.index;
    wx.showLoading({
      title: '正在删除商品',
    })
    wx.request({
      url: app.hostName + that.data.reqDeleteItem ,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        cart_ids: delItem,
        token: this.data.token,
      },
      dataType: 'json',
      success: function (d) {
        wx.hideLoading();
        if (d.statusCode == 200) {
          switch (d.data.status) {
            case 1:
              wx.showToast({
                title: d.data.msg,
                icon: 'success',
                duration: 2000
              })
              break;
            case 2:
              wx.showToast({
                title: d.data.msg,
                icon: 'none',
                duration: 2000
              })
              break;
            default:
              break;
          }
          that.loadCartList();
        }
      }
    })
  },
  checkCart: function(){
    //检查购物车
    let that = this;
    let cartContents = that.data.noProduct;

    if (that.data.cartArray.length != 0) {
      //有商品
      cartContents = false;
    } else {
      //没有商品
      cartContents = true;
    }

    that.setData({
      noProduct: cartContents
    })
  },

  confirm_counting:function(){
    let that = this
    //购物车结算
    // wx.navigateTo({
    //   url: '../neworder/neworder?token=' + this.data.token,
    // })
    //跳转到支付页面
    wx.showLoading({
      title: '正在结算',
    })
    wx.request({
      url: app.hostName + that.data.reqAddOrder,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: that.data.token,
      },
      dataType: 'json',
      success: function (d) {
        wx.hideLoading();
        if (d.statusCode == 200) {
          wx.setStorage({
            key: "order_info",
            data: {
              order: d.data.order,
              order_goods: d.data.order_goods
            },
            success: function () {
              wx.navigateTo({
                url: '../neworder/neworder',
              })
            }
          })
        }
      }
    })
  },
  check_user_info: function(){
    let that = this;
    wx.request({
      url: app.hostName + '/mobile/Cart/check_user_use_youhui',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: that.data.token,
      },
      dataType: 'json',
      success: function (d) {
        that.setData({
          canBuy: d.data.status
        })
        // console.log(that.data.canBuy);
      },
      fail:function(){}
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
    if (this.data.token != "") {
      this.check_user_info();
    }
    this.checkCart();
    this.loadCartList();
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