let common = require('../../utils/util.js');
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
    /**
     * 页面名称
     */
    name: "box",
    /**
     * 页面的初始数据
     */

    data: {
        boxList: [],
        boxCount: 0,
        baseImg: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad () {
        let that = this;
        if (common.checkLogin()) {
            that.requestData();
        } else {
            that.userLogin();
        }

    },
    onReady () {
        let that = this;
        that.setData({
            baseImg: common.imgDefault
        });
    },
    onShow(){
        let that = this;
        if (common.checkLogin()) {
            that.requestData();
        }
    },
    requestData: function () {
        let that = this;
        common.getOwnBox({}, {
            func: function (response) {
                console.info("box 返回数据", response);
                that.makeData(response)
            },
            context: that
        })
    },
    makeData: function (res) {
        res.forEach(function (item) {
            console.log(item);
            let imgArr = [];
            item.img && (imgArr = item.img.split("-"));
            item.img = item.img ? common.getImgUrl(imgArr[0]) : common.imgDefault;
            item.eventTimeStr = common.formatTimeLine(item.eventTime, 'time');
            item.eventTime = common.formatTimeLine(item.eventTime, 'date');
            item.createTime = common.formatCreate(item.created_at, 'time');
            item.createDate = common.formatCreate(item.created_at, 'date')

        });
        this.setData({boxList: res})

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
                console.log('wx user info', res);
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {
        let that = this;
        that.requestData();
    },
})

