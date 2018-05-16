let common = require('../../utils/util.js');
Page({
    name: "error",
    data: {},
    onLoad () {
    },
    onReady () {
    },
    onShow(){
    },
    createUserRandom() {
      common.createUser({}, function (response) {
        console.log(response)
        wx.setStorageSync('token', response.token);
        wx.setStorageSync('info', response.info);
        wx.navigateTo({
          url: '/pages/index/index',
        })
      });
    },
    bindgetuserinfo(e) {
      common.userLogin(function () {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      })
    }

});

