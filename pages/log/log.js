let common = require('../../utils/util.js');
// pages/log/log.js
Page({
  data: {
    list:[]
  },
  onShow: function () {
    this.getList();
  },
  getList() {
    let that = this;
    common.getUpdateList({}, function (res) {
      that.setData({ list: res });
      wx.stopPullDownRefresh()
    })
  },
  onPullDownRefresh: function () {
    this.getList();
  }
})