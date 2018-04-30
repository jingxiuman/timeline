var moment = require('./moment.min.js');
moment.locale('zh-cn');
let commonFunc = {
  moment: moment,
  /**
   * ajax传送
   */
  debug: 'test',
  formatTimeToNow(timeStamps) {
    var day = moment(timeStamps * 1000);
    var now = moment();
    return Math.abs(now.diff(day, 'day'));
  },
  defaultBg: {
    index: 'http://cdn.xbpig.cn/common/indexBg.png',
    item: 'http://cdn.xbpig.cn/common/colorful-bubble-with-reflection-of-prague-buildings-picjumbo-com.jpg?imageView2/0/w/300/h/250'
  },
  /**
   * 检测用户是否登陆
   */
  checkLogin: function () {
    let token = wx.getStorageSync('token'),
      info = wx.getStorageSync('info');
    if (token != '' && info != '') {
      return true;
    } else {
      return false;
    }
  },
  url: function () {
    let str = '';
    if (this.debug == 'test') {
      str = 'http://api.xbpig.cn'
    } else if (this.debug == 'local') {
      str = 'http://api.xbpig.cn'
    } else {
      str = 'https://api.xbpig.cn'
    }
    return str;
  },
  imgDefault: 'http://cdn.xbpig.cn/common/colorful-bubble-with-reflection-of-prague-buildings-picjumbo-com.jpg?imageView2/0/w/300/h/250',
  getImgUrl(img, w, h, type) {
    if (!w) w = 300;
    if (!h) h = 250;
    if (type!== 0 && !type) type = 1;
    let url;
    if(this.debug ==='test') {
      url='http://ohhuk1c8m.bkt.clouddn.com/'
    } else {
      url = 'http://cdn.xbpig.cn/' 
    }
    return url + img + '?imageView2/' + type+'/w/' + w + '/h/' + h
  },
  formatTimeLine: function (timestamps, type) {
    let str = '', nowTime = new Date().getTime(), interval, year, day, dateStr, timeStr;
    timestamps *= 1000;
    interval = Math.round(Math.abs((timestamps - nowTime) / 86400000));
    year = parseInt(interval / 365);
    day = parseInt(interval % 365);
    let timS = timestamps;
    let date = new Date(timS),
      date_year = date.getFullYear(),
      date_month = date.getMonth() + 1;
    dateStr = '距离' + date_year + '年' + date_month + '月' + date.getDate() + '日';
    if (year > 0) {
      timeStr = year + '年' + day + '天';
    } else {
      timeStr = day + '天';
    }
    if (type === 'date') {
      str = dateStr;
    } else if (type === 'time') {
      str = timeStr;
    } else if (type === 'day') {
      str = interval + '天'
    }
    return str;
  },
  formatCreate: function (timestamp, type) {
    let time = new Date(timestamp * 1000), str;
    if (type === 'time') {
      str = time.getHours() + ':' + time.getMinutes();
    } else if (type === 'date') {
      str = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate();
      // str = time.getDate();
    } else if (type === 'all') {
      str = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes();

    }
    return str;
  },

  ajaxFunc: function (url, data, callback, type) {
    let self = this;
    data.token = wx.getStorageSync('token');
    data.info = wx.getStorageSync('info');
    let urlStr = self.url() + url;
    wx.showLoading({ title: '加载中' })
    wx.request({
      url: urlStr, //仅为示例，并非真实的接口地址
      data: data,
      method: type || 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        let response = res.data;
        console.log("返回", response);
        if (response.code == 10001) {
          wx.clearStorage();
          wx.showToast({
            title: response.msg || '接口异常 code:10001',
            duration: 2000
          });

        } else if(response.code != 0) {
          wx.showToast({
            title: response.msg || '接口异常 code:' + res.code,
            duration: 2000
          });
          if (response.code == 1111) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('info');

          }
        }
        if (typeof (callback) == 'function' && (response.code || response.code == 0)) {
          callback.call(null, response.data, response.code)
        } else {
          return;
        }

      },
      fail: function (e) {
        console.error(e)
        wx.showToast({
          title: "网络连接异常",
          duration: 2000
        });
      }
    })
  },
  wxUserLogin: function (data, callback) {
    this.ajaxFunc('/api2/wx/login', data, callback)
  },
  getWxUser: function (data, callback) {
    this.ajaxFunc('/api2/user/detail', data, callback)
  },
  wxUserCode: function (data, callback) {
    this.ajaxFunc('/api2/wx/addCode', data, callback)
  },
  getOwnBox: function (data, callback) {
    this.ajaxFunc('/api2/box/own', data, callback)
  },
  getBoxDetailByOwn: function (data, callback) {
    this.ajaxFunc('/api2/box/one', data, callback)
  },
  addPic: function (data, callback) {
    let self = this;
    let urlStr = self.url() + '/api2/pic/add';
    wx.uploadFile({
      url: urlStr, //仅为示例，非真实的接口地址
      filePath: data[0],
      name: 'img',
      formData: {
        token: wx.getStorageSync('token'),
        info: wx.getStorageSync('info')
      },
      success: function (res) {
        let response = JSON.parse(res.data);
        if (response.code == 0) {
          if (!callback) return;
          if (typeof (callback) == 'function') {
            callback.call(null, response.data)
          }
        } else {
          wx.showToast({
            title: response.msg || 'fail',
            duration: 2000
          });
          if (response.code == 1111) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('info');

          }
        }
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  addBoxDetail: function (data, callback) {
    this.ajaxFunc('/api2/box/add', data, callback)
  },
  createUser: function (data, callback) {
    this.ajaxFunc('/api2/wx/loginNone', data, callback)
  },
  getAddress: function (data, callback) {
    this.ajaxFunc('/api2/address/get', data, callback)
  },
  addAdvice: function (data, callback) {
    this.ajaxFunc('/api2/advice/add', data, callback)
  },
  getUpdateList: function (data, callback) {
    this.ajaxFunc('/api2/system/update/list', data, callback)
  },
  delBoxOne: function (data, callback) {
    this.ajaxFunc('/api2/box/del', data, callback)
  },
  updateBoxOne: function (data, callback) {
    this.ajaxFunc('/api2/box/update', data, callback)
  },
  getRandomOne: function (data, callback) {
    this.ajaxFunc('/api2/box/randomOne', data, callback)
  }
};

module.exports = commonFunc;
