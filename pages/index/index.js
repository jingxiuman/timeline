let common = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      bgImg:'',
      eventName:'',
      eventDay:0,
    },
    isAnswer: false,
    bgImg: common.defaultBg.index,
  },
  onLaunch:function() {
   
  },
  onShow: function () {
    let that = this;
    wx.hideTabBar({});
    common.checkLogin(function () {
      wx.getStorage({
        key: 'launchIndex',
        success: function (res) {
          let num = res.data;
          console.log(num);
          if (num && num % 3 === 0) {
            wx.setStorageSync('launchIndex', ++num)
            wx.switchTab({
              url: '/pages/box/box'
            })
          } else {
            wx.setStorageSync('launchIndex', ++num)
            that.requestData();
          }
        },
        fail: function () {
          console.log('asd')
          wx.setStorageSync('launchIndex', 1)
          that.requestData();
        }
      })
    }, function () {
      common.userLogin(function () {
        that.requestData()
      });
    })
  },
  requestData () {
    console.log("get box");
    let that = this;
    common.getRandomOne({}, function (res, code) {
      if(code === 1111 || code == 10001) {
        common.userLogin();
      }
      if (res) {
        that.setData({
          info: {
            bgImg: res.img ? (res.cdn + res.img) : that.imgBg,
            eventName: res.eventName,
            eventDay: common.formatTimeToNow(res.eventTime),
          },
          isAnswer: true
        })
      }
    })
  },
  
  imgLoadError(e){
    console.log(e);
    this.setData({
      'info.bgImg': common.defaultBg.index
    })
  }
})