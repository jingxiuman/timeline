//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
      wx.getStorageInfo({
          success: function (res) {
              console.info(res.keys)
              console.info(res.currentSize)
              console.info(res.limitSize)
          }
      })

  },
});
