// pages/video/video.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostName: app.hostName,
    token: '',
    isUse: false,
    videoId: "",
    reqVideoDetail: "/mobile/goods/vedio_msg",
    reqAjaxCart:"/mobile/Cart/ajaxAddCart",
    reqData:{},
    videoArray:{
      "link": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
      "title": "视频标题"
    },
    articleArray: [
      { "id": "1", "title": "文章标题", "caption": "文章内容", "img": "../../assets/img/article-img.jpg" },
      { "id": "2", "title": "文章标题", "caption": "文章内容", "img": "../../assets/img/article-img.jpg" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let token = wx.getStorageSync('user_token').token || "";
    that.setData({
      token: token,
      videoId: options.id
    })
    that.getVideoDetail();
  },
  addToCart:function(){
    let that = this
    // console.log(that.data.token);
    if(that.data.token!=""){
      wx.request({
        url: app.hostName + that.data.reqAjaxCart,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data:{
          goods_id: that.data.videoId,
          goods_num: 1,
          token: that.data.token,
        },
        dataType: 'json',
        success: function (d) {
          // console.log(d.data);
          if (d.statusCode == 200) {
            switch (d.data.status){
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
              case -2:
                wx.showToast({
                  title: d.data.msg,
                  icon: 'none',
                  duration: 2000,
                  mask:true
                })
                setTimeout(()=>{
                  wx.navigateTo({
                    url: '../myphone/myphone',
                  })
                },2000)
                break;
              default:
              break;
            }
            
          }
        }
      })
    }else{
      wx.showToast({
        title: '请先绑定手机并授权登录',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getVideoDetail: function () {
    let that = this
    wx.showLoading({
      title: '数据读取中',
    })
    wx.request({
      url: app.hostName + that.data.reqVideoDetail,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data:{
        id: that.data.videoId,
        token: that.data.token
      },
      dataType: 'json',
      success: function (d) {
        // console.log(d.data);
        wx.hideLoading()
        if (d.statusCode == 200) {
          let canUse = false

          if (d.data.flag_use==2){
            canUse=false
          }else{
            canUse=true
          }
          that.setData({
            isUse: canUse,
            reqData: d.data
          })
        }
      }
    })
  },

  toCart:function(){
    wx.switchTab({
      url: '../cart/cart'
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
    let that = this;
    
    return {
      title: that.data.reqData.goods.goods_name,
      path: 'pages/video/video?id=' + that.data.reqData.goods.goods_id,
      imageUrl: that.data.hostName + that.data.reqData.goods.original_img
    }
  }
})