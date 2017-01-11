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

    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad () {

    },
    onReady () {


    },
    onShow(){

    },
    userLogin: function () {
        let that = this,
            flag = 0; // 0:代表已经注册过了 1:表示没有注册登陆过
        wx.login({
            success: function (res_main) {
                console.log('get code', res_main)
                common.wxUserCode({
                    code: res_main.code,
                    //  token:wx.getStorageSync('wx_token')
                }, {
                    func: function (response_code) {
                        console.log('response_code', response_code)
                        wx.setStorageSync('wx_token', response_code.token);
                        that.setUserInfo();
                    },
                    context: that
                })
            }
        });
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
                //console.error(e);
                wx.redirectTo({
                    url: '/pages/error/error'
                })
            }
        })

    },

});

