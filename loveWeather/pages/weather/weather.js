let wxCharts = require('../../utils/wxcharts.js');
//获取应用实例
const app = getApp()
const key = '77f94fca7bd647ba8a99c6bb2739b079'
Page({
  data: {
    loading: true,
    weather: null,
    trend: null,
    bearth: null,
    future: null,
    life: null,
    day: [],
    imageUrl:'noon',
    location: '',
    position:null
  },
  factory: function(url,datakey){
    let str = "location="+this.data.location+"&key="+key
    let _that = this
    wx.request({
      url: url + str, 
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.HeWeather6[0].status != 'ok'){
          _that.setData({
            [datakey]: false
          })
          return;
        }
        if (datakey === 'life') {
          let total = res.data.HeWeather6[0]
          let txt = total.lifestyle.filter(function(x){
            return x.type == 'drsg'
          })
          _that.setData({
            [datakey]: txt[0]
          })
        }else{
          _that.setData({
            [datakey]: res.data.HeWeather6[0]
          })
          if(_that.data.trend){
            _that.drawChart()
          }
        }
        if(datakey === 'future'){
          let dayArr = _that.data.day
          _that.data.future.daily_forecast.forEach(function(x,index){
            let dateStr = x.date.split('-')[1]+'-'+x.date.split('-')[2]
            if(index>=3){
              dayArr.push(dateStr)
            }
          })
          _that.setData({
            day: dayArr
          })
        }
      }
    })
  },
  checkPos: function(){
    let _that = this
    wx.getLocation({
      success: function (res) {
        _that.setData({
          position: {
            x: res.longitude,
            y: res.latitude
          }
        })
      },
      complete: function () {
        if (_that.data.position) {
          wx.request({
            url: 'https://free-api.heweather.com/s6/search?location=' + _that.data.position.x + ',' + _that.data.position.y + '&key=' + key,
            success: function (res) {
              _that.setData({
                location: res.data.HeWeather6[0].basic.cid
              })
              _that.init()
            }
          })
        }
      }
    })
  },
  getPos:function(options){
    //获取位置
    if (options.location) {
      this.setData({
        location: options.location
      })
      this.init()
    } else {
      this.checkPos()
    }
  },
  drawChart: function(){
    let categories = []
    let seriesdata = []
    let arr = this.data.trend.hourly
    arr.forEach(function(x){
      let time = x.time.split(' ')[1]
      categories.push(time)
      seriesdata.push(x.tmp)
    })
    // 图表宽度自适应
    let windowWidth = 320;
    let res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth-10;
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      legend: false,
      categories: categories,
      series: [{
        name: '当前气温',
        data: seriesdata,
        color: '#3c5f81',
        format: function (val) {
          return val + '℃';
        }
      }],
      xAxis: {
        disableGrid: true,
        fontColor: '#333'
      },
      yAxis: {
        // title: '气温 ℃',
        disabled: true,
        gridColor: '#f5f5f5',
        fontColor: '#333',
        titleFontColor: '#3c5f81',
        format: function (val) {
          return val;
        },
        min: 0
      },
      extra: {
        lineStyle: 'curve'
      },
      width: windowWidth,
      height: 160
    })
  },
  init:function(){
    let dateArr = ['一','二','三','四','五','六','日','一']
    let imgArr = ['moring','noon','afternoon','night']
    let index = 0
    let now = new Date()
    let hour = now.getHours()
    if(hour<=10){
      index = 0
    }else if(hour>10&&hour<=14){
      index = 1
    }else if(hour>14&&hour<=20){
      index = 2
    }else{
      index = 3
    }
    this.setData({
      day: ['今天','明天','星期'+dateArr[now.getDay() + 1]],
      imageUrl: imgArr[index]
    })

    this.factory('https://free-api.heweather.com/s6/weather/now?','weather',)
    this.factory('https://free-api.heweather.com/s6/weather/hourly?', 'trend')
    this.factory('https://free-api.heweather.com/s6/air/now?','bearth')
    this.factory('https://free-api.heweather.com/s6/weather/forecast?','future')
    this.factory('https://free-api.heweather.com/s6/weather/lifestyle?', 'life')
    this.setData({
      loading: false
    })
  },
  locationChange: function(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  onLoad: function (options) {
    // this.getPos(options);
    let _that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.getPos(options)
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.getPos(options)
        },fail:function(){
          wx.showModal({
            title: '提示',
            content: '未经授权不能正确的展示信息，点击确定重新获取授权或直接退出小程序',
            showCancel: true,
            confirmText: '确定',
            cancelText: '退出',
            success: function(res){
              if(res.confirm){
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录    
                      wx.getUserInfo({
                        success: function(res) {
                          this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  },
  onReady: function(){
    // this.setData({
    //   loading: false
    // })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function(){
    return {
      title: '看看今天的天气穿什么吧～',
      path: '/pages/weather/weather',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
