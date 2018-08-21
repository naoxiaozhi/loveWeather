//index.js
//获取应用实例
const app = getApp()

var API = require('../../utils/api.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    disable: true,
    keyword: '',
    searchlist: [],
    showlist: false,
    hot: [],
    location: ''
  },
  init: function(){
    this.hotcity()
  },
  // clickSelected: function(e) {
  //   this.setData({
  //     keyword: e.target.dataset.text,
  //     searchlist: [],
  //     showlist: false,
  //     disable: false
  //   })
  // },
  inputChange: function(val) {
    let value = val.detail.value
    let _that = this
    _that.setData({
      keyword: value
    })
    if(value.length > 0){
      _that.searchFunc()
      _that.setData({
        disable: false,
        showlist: true
      })
    }else{
      this.setData({
        disable: true,
        showlist: false
      })
    }
  },
  hotcity: function(){
    let key = '77f94fca7bd647ba8a99c6bb2739b079'
    let _that = this
    wx.request({
      url: 'https://search.heweather.com/top?group=cn&key=' + key,
      success: function (res) {
        _that.setData({
          hot: res.data.HeWeather6[0].basic
        })
      }
    })
  },
  searchFunc: function() {
    let key = '77f94fca7bd647ba8a99c6bb2739b079'
    let _that = this
    let parameters = 'location=' + this.data.keyword +'&group=cn'+'&key='+key
    wx.request({
      url: 'https://search.heweather.com/find?'+parameters,
      success: function (res) {
        let list = res.data.HeWeather6[0].basic
        list = list.filter(function(x){
          return x.type === 'city'
        })
        _that.setData({
          searchlist: list
        })
      }
    })
  },
  checkCity: function(e){
    wx.navigateTo({
      url: '../weather/weather?location='+e.target.id
    })
  },
  onLoad: function () {
    this.init()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
