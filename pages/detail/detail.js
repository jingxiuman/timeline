let common = require('../../utils/util.js');
Page({
  name: "detail",
  data: {
    detail: {},
    id: 0,
    showEdit: true,
    isShare: 0

  },
  onLoad(e) {
    var allData = getApp().shareData;
    
    this.setData({
      id: e.id,
      isShare: !allData.shareFlag
    });
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
          let imgTmp = common.getImgUrl(item.url, 640, 360, 0)
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
  onPullDownRefresh() {
    try {
      wx.stopPullDownRefresh()
    } catch (e) {
      console.log(e);
    }
  }
  ,
  // onShareAppMessage: function () {
  //   var that = this;
  //   var allData = getApp().shareData;
  //   console.log(getApp().shareData,'all');
  //   let shareData = {
  //     title: allData.shareTitle,
  //     path: allData.sharePath,
  //     imageUrl: allData.shareImage
  //   }

  //   return allData.shareFlag == 1 ? shareData : {
  //     title: that.data.detail.eventName,
  //     path: 'pages/index/index',
  //   };
  // }
})
  ;

