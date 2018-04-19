let common = require('../../utils/util.js');
Page({
  name: "detail",
  data: {
    detail: {},
    id: 0,
    showEdit: true

  },
  onLoad(e) {
    this.setData({
      id: e.id,
    })
  },
  onShow() {
    wx.showLoading({ title: '加载中' });
    let that = this;
    common.getBoxDetailByOwn({
      id: that.data.id
    }, function (response) {
      let timeAll = common.formatTimeLine(response.eventTime, 'time');
      let imgA = [];
      let img = '';
      response.img.forEach(function (item, index) {
        if (item.url) {
          let imgTmp = common.getImgUrl(item.url, 640, 360)
          if (index === 0) {
            img = imgTmp
          } else {
            imgA.push(imgTmp)
          }
        }
      });
      wx.setNavigationBarTitle({
        title: response.eventName || '旧时光详情'
      });
      that.setData({
        detail: {
          img: img,
          eventName: response.eventName,
          eventTime: "1472398615",
          timeStr: common.formatTimeLine(response.eventTime, 'time'),
          timeStr2: common.formatTimeLine(response.eventTime, 'day'),
          dateStr: common.formatTimeLine(response.eventTime, 'date'),
          id: response.id,
          address: response.address,
          imgList: imgA,
          created_at: response.created_at,
          eventContent: response.eventContent
        }
      });
      wx.hideToast();
      if (response.isDefault) {
        that.setData({
          showEdit: false
        })
      }
    });
  },
  onReady() {


  },
  onPullDownRefresh() {
    try {
      wx.stopPullDownRefresh()
    } catch (e) {
      console.log(e);
    }
  }
  ,
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '记录我们距离上一次幸福时光的时间，摆脱时间的遗忘',
      path: '/pages/box/box',
      imageUrl: 'http://cdn.xbpig.cn/common/shareMain.png'
    }
  }
})
  ;

