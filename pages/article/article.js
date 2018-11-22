// pages/article/article.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostName: app.hostName,
    requestTargetArticleList: '/mobile/Api/get_article_list',
    reqArticleCat: '/mobile/Api/get_article_cat',
    filterShow: false,
    showFilter: "",
    articleArray: [],
    filterArray: [
      { "cat_id": "1", "cat_name": "学校名称1" },
      { "cat_id": "2", "cat_name": "学校名称2" },
      { "cat_id": "3", "cat_name": "学校名称3" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleList();
    this.getCateList();
  },
  getArticleList: function (id) {
    let that = this
    let cat_id = id || 1;
    wx.showLoading({
      title: '数据读取中',
    })
    // console.log(cat_id)
    wx.request({
      url: app.hostName + that.data.requestTargetArticleList + '?cat_id=' + cat_id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (d) {
        wx.hideLoading();
        if (d.statusCode == 200) {
          // console.log(d.data)
          let list = d.data.list
          that.setData({
            articleArray: list
          })
        }
      }
    })
  },
  getCateList:function(){
    let that = this
    wx.request({
      url: app.hostName + that.data.reqArticleCat,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (d) {
        if (d.statusCode == 200) {
          // console.log(d.data)
          let cate = d.data
          that.setData({
            filterArray: cate
          })
        }
      }
    })
  },
  chooseCate:function(e){
    let cateId = e.target.dataset.catid;
    this.getArticleList(cateId);
    this.showFilter();
  },
  showFilter: function () {
    let toggleFilter = this.data.filterShow;
    let toggleClass = "";

    (!toggleFilter) ? toggleClass = "show" : toggleClass = ""

    this.setData({
      filterShow: !toggleFilter,
      showFilter: toggleClass
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