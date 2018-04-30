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
    }
  },
  onShow: function () {
    let that = this;
    wx.hideTabBar({});
    if (!common.checkLogin()) {
      that.userLogin();
    } else {
      that.requestData();
    }
  },
  requestData () {
    console.log("get box");
    let that = this;
    common.getRandomOne({}, function (res, code) {
      console.log(res);
      if(code === 1111 || code == 10001) {
        that.userLogin();
      }
      that.setData({
        info: {
          bgImg: res.img ? (res.cdn + res.img) : that.imgBg,
          eventName: res.eventName,
          eventDay: common.formatTimeToNow(res.eventTime),
        }
      })
    })
  },
  setUserInfo: function () {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        res.wx_token = wx.getStorageSync('wx_token');
        common.wxUserLogin(res, function (response) {
          wx.setStorageSync('token', response.token);
          wx.setStorageSync('info', response.info);
          getApp().globalData.userInfo = res.userInfo;
          that.requestData();
        })
      },
      fail: function (e) {
        common.createUser({}, {
          func: function (response) {
            wx.setStorageSync('token', response.token);
            wx.setStorageSync('info', response.info);
            getApp().globalData.userInfo = response.userInfo;
            that.requestData();
          }
        });
      }
    })
  },
  userLogin: function () {
    let that = this;
    wx.login({
      success: function (res_main) {
        common.wxUserCode({
          code: res_main.code,
          //  token:wx.getStorageSync('wx_token')
        }, function (response_code) {
          wx.setStorageSync('wx_token', response_code.token);
          that.setUserInfo();
        });
      }
    });
  },
  imgLoadError(e){
    console.log(e);
    this.setData({
      'info.bgImg': common.defaultBg.index
    })
  }
})