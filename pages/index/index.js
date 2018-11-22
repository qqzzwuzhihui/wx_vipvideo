//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hostName: app.hostName,
    requestTargetVideo: '/mobile/goods/get_vedio_list',
    requestTargetSlider: '/mobile/Api/get_flash_list',
    sliderArray:{
      imgUrls: []
    },
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    videoData:[],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    page: 1,
    totalPages: 1
  },
  getFlashList: function(){
    let that = this
    wx.request({
      url: app.hostName + that.data.requestTargetSlider,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (d) {
        // console.log(d);
        let _list = d.data.ad_list;
        let _interval = d.data.ad_time_slide;
        
        if(d.statusCode==200){
          that.setData({
            sliderArray: {
              imgUrls: _list
            },
            interval: _interval
          })
          
        }
      }
    })
  },
  getVideoList: function(){
    let that = this
    wx.showLoading({
      title: '数据读取中',
    })
    wx.request({
      url: app.hostName + that.data.requestTargetVideo,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success:function(d){
        wx.hideLoading();
        // console.log(d);
        if (d.statusCode == 200) {
          that.setData({
            videoData: d.data.goods_list,
            page: d.data.page.nowPage,
            totalPages: d.data.page.totalPages
          })
        }
      }
    })
  },

  getMoreVideo: function(){
    let that = this
    let nextPage = Number(that.data.page);
    nextPage++
    console.log(nextPage);
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.hostName + that.data.requestTargetVideo + '?page=' + nextPage,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (d) {
        wx.hideLoading();
        
        if (d.statusCode == 200) {
          let newVideoList = that.data.videoData;
          newVideoList.push(d.data.goods_list);
          that.setData({
            videoData: newVideoList,
            page: nextPage
          })
        }
      }
    })
  },
  onLoad: function () {
    // app.login();
  },
  onShow:function(){
    this.getVideoList();
    this.getFlashList();
  }, 
  onShareAppMessage: function () {
    return {
      title: '艺术生艺考',
      path: 'pages/index/index'
    }
  }
})
