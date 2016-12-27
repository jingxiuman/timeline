let commonFunc = {
    /**
     * ajax传送
     */
    debug: false,
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
        if (this.debug) {
            str = 'https://test.knowthis.site'
        } else {
            str = 'https://lovelog.zhouxianbao.cn'
        }
        return str;
    },
    baseImg(){
        return this.imgUrl() + 's_274ffe054868503f5ad33125e964dc13142502.jpg?imageView2/0/w/300'
    },
    imgUrl: function () {
        let str = '';
        if (!this.debug) {
            str = 'http://cdn.xbpig.cn/'
        } else {
            str = 'http://ohhuk1c8m.bkt.clouddn.com/'
        }
        return str;
    },
    formatDate: function (time) {
        let nowTime = new Date().getTime(), interval, type, year, day, dateStr, timeStr;
        time *= 1000;
        if (time > nowTime) {
            type = '未来';
        } else {
            type = '过去';
        }
        interval = Math.round(Math.abs((time - nowTime) / 86400000));
        year = parseInt(interval / 365);
        day = parseInt(interval % 365);
        let timS = time / 1;
        let date = new Date(timS),
            date_year = date.getFullYear(),
            date_month = date.getMonth() + 1;
        dateStr = '距离' + date_year + '年' + date_month + '月' + date.getDate() + '日';
        if (year > 0) {
            timeStr = year + '年' + day + '天';
        } else {
            timeStr = day + '天';
        }
        return {
            dateStr: dateStr,
            timeStr: timeStr,
            type: type,
        }
    },
    ajaxFunc: function (url, data, callback, type) {
        let self = this;
        data.token = wx.getStorageSync('token');
        data.info = wx.getStorageSync('info');
        let urlStr = self.url() + url;
        console.info("url:", urlStr)
        wx.request({
            url: urlStr, //仅为示例，并非真实的接口地址
            data: data,
            method: type || 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                let response = res.data;
                console.log("返回", response);
                if (response.code == 0) {
                    if (!callback) return;
                    let callbackFunc = callback.func,
                        callbackContext = callback.context;
                    callbackFunc && typeof(callbackFunc) == 'function' && callbackFunc.call(callbackContext, response.data);
                } else if (response.code == 10001) {
                    wx.clearStorage();
                    wx.showToast({
                        title: response.msg || '',
                        duration: 2000
                    });

                } else {
                    wx.showToast({
                        title: response.msg || '',
                        duration: 2000
                    });
                    if (response.code == 1111) {
                        wx.removeStorageSync('token');
                        wx.removeStorageSync('info');

                    }
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
    getBoxList: function (data, callback) {
        this.ajaxFunc('/box/all', data, callback)
    },
    wxUserLogin: function (data, callback) {
        this.ajaxFunc('/users/wxLogin', data, callback)
    },
    getWxUser: function (data, callback) {
        this.ajaxFunc('/users/getWxUser', data, callback)
    },
    wxUserCode: function (data, callback) {
        this.ajaxFunc('/users/wxCode', data, callback)
    },
    getOwnBox: function (data, callback) {
        this.ajaxFunc('/box/all', data, callback)
    },
    getAllBox: function (data, callback) {
        this.ajaxFunc('/box/ownAndOther', data, callback, 'GET')
    },
    getBoxDetailByOwn: function (data, callback) {
        this.ajaxFunc('/box/getOne', data, callback)
    },
    addPic: function (data, callback) {
        let self = this;
        let urlStr = self.url() + '/pic/add';
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
                    let callbackFunc = callback.func,
                        callbackContext = callback.context;
                    callbackFunc && typeof(callbackFunc) == 'function' && callbackFunc.call(callbackContext, response.data);
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
        this.ajaxFunc('/box/addWxBox', data, callback)
    },
    getBoxComment: function (data, callback) {
        this.ajaxFunc('/comment/boxDetail/' + data.id, {}, callback, 'GET')
    },
    addBoxComment: function (data, callback) {
        this.ajaxFunc('/comment/add', data, callback)
    },
    shareBox: function (data, callback) {
        this.ajaxFunc('/box/share', data, callback)
    }
};

module.exports = commonFunc;
