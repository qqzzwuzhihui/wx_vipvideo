// pages/myvideo/myvideo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reqMyVideo: '/mobile/Order/order_list',
    testData:[
      { 'id': '1', 'status': '0', 'title': 'C罗1亿欧转会尤文 四年合约年薪3000万', 'img': '../../assets/img/title-img.jpg' },
      { 'id': '2', 'status': '1', 'title': '阿扎尔上演突破教学课 完爆对手无奈进球运气不佳', 'img': '../../assets/img/title-img2.jpg' }
    ],
    videoData: [],
    hasData: false,
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
    if (token != "") {
      this.loadMyVideoList()
    }
    
  },
  loadMyVideoList: function(){
    let that = this;
    wx.showLoading({
      title: '数据读取中',
    })
    wx.request({
      url: app.hostName + that.data.reqMyVideo,
      data: {
        token: that.data.token
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        wx.hideLoading();
        if(res.statusCode == 200){
          if (res.data.order_list.length>0){
            that.setData({
              videoData: res.data.order_list,
              hasData: true
            })
          }else{
            that.setData({
              videoData: res.data.order_list,
              hasData: false
            })
          }
        }
        
      },
      fail: function(res) {},
      complete: function(res) {},
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