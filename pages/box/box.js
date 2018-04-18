let common = require('../../utils/util.js');
const app = getApp();

Page({
  name: "box",
  data: {
    boxList: [],
    boxCount: 0,
    baseImg: ''
  },
  isLongTap: false,
  onLoad() {
  },
  onReady() {
    let that = this;
    that.setData({
      baseImg: common.imgDefault
    });
  },
  onShow() {
    this.requestData();
  },
  requestData: function () {
    let that = this;
    common.getOwnBox({}, function (response) {
      that.makeData(response)
    });
  },
  makeData: function (res) {
    res.forEach(function (item) {
      item.img = item.img.length > 0 ? common.getImgUrl(item.img[0].url) : common.imgDefault;
      item.eventTimeStr = common.formatTimeLine(item.eventTime, 'day');
      item.eventTimeStr2 = common.formatTimeLine(item.eventTime, 'time');
      item.eventTime = common.formatTimeLine(item.eventTime, 'date');
      item.createTime = common.formatCreate(item.created_at, 'time');
      item.createDate = common.formatCreate(item.created_at, 'date')
    });
    this.setData({ boxList: res })
  },
  delBox: function (e) {
    console.log("long", e);
    this.isLongTap = true;
    let that = this;
    //TODO 完成删除逻辑
    wx.showModal({
      title: '提示',
      content: '确认删除当前的事件',
      success: function (res) {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id;
          common.delBoxOne({
            id: id
          }, {
              func: function (res) {
                that.requestData();
                wx.showToast({
                  title: '删除成功'
                })
              },
              context: that
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    return false

  },
  goToDetail: function (e) {
    console.log("tap", e);
    let id = e.currentTarget.dataset.id;
    if (this.isLongTap) {
      this.isLongTap = false;
      return
    }
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })

  },
  userLogin: function () {
    let that = this;
    wx.login({
      success: function (res_main) {
        common.wxUserCode({
          code: res_main.code,
          //  token:wx.getStorageSync('wx_token')
        }, {
            func: function (response_code) {
              wx.setStorageSync('wx_token', response_code.token);
              that.setUserInfo();
            },
            context: that
          })
      }
    });
  },
  getUserInfo: function () {
    let that = this;

  },
  setUserInfo: function () {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        res.wx_token = wx.getStorageSync('wx_token');
        console.log('wx user info', JSON.stringify(res));
        common.wxUserLogin(res, {
          func: function (response) {
            wx.setStorageSync('token', response.token);
            wx.setStorageSync('info', response.info);
            app.globalData.userInfo = res.userInfo;
            that.requestData();
          },
          context: that
        })
      },
      fail: function (e) {
        common.createUser({}, {
          func: function (response) {
            wx.setStorageSync('token', response.token);
            wx.setStorageSync('info', response.info);
            app.globalData.userInfo = response.userInfo;
            that.requestData();
          }
        });
      }
    })
  },
  onPullDownRefresh() {
    let that = this;
    that.requestData();
  },
  imgLoadError(e) {
    console.log(e);
    this.setData({
      'info.bgImg': common.defaultBg.index
    })
  }
})

