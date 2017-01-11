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
        wx.showNavigationBarLoading();
        let that = this;
        if (common.checkLogin()) {

            that.requestData();
            that.getUserInfo();
        } else {
            that.userLogin();
        }

    },
    onReady () {
        let that = this;
        that.setData({
            baseImg: common.baseImg()
        });
    },
    onShow(){
        let that = this;

    },
    requestData: function () {
        let that = this;
        common.getOwnBox({}, {
            func: function (response) {
                console.info("box 返回数据", response);
                wx.hideNavigationBarLoading()
                that.makeData(response)
            },
            context: that
        })
    },
    makeData: function (DataMain) {
        let that = this, tempArr = [];
        let nowTime = new Date().getTime(), interval, type, year, day, dateStr, timeStr;
        if (DataMain.count > 0) {

            DataMain.data.forEach(function (item) {
                item.eventTime *= 1000;
                if (item.eventTime > nowTime) {
                    type = '未来';

                } else {
                    type = '过去';
                }
                interval = Math.round(Math.abs((item.eventTime - nowTime) / 86400000));


                year = parseInt(interval / 365);
                day = parseInt(interval % 365);

                let timS = item.eventTime / 1;

                let date = new Date(timS),
                    date_year = date.getFullYear(),
                    date_month = date.getMonth() + 1;

                dateStr = '距离' + date_year + '年' + date_month + '月' + date.getDate() + '日';
                if (year > 0) {
                    timeStr = year + '年' + day + '天';
                } else {
                    timeStr = day + '天';
                }
                // console.log("总共"+interval+'天'+"--"+year+'年'+day+'天,时间:'+dateStr);
                let img_t = '';
                //console.log(img_t)
                if (item.img != '') {

                    img_t = common.imgUrl() + item.img + '?imageView2/0/w/300'
                }
                tempArr.push({
                    id: item.id,
                    eventName: item.eventName,
                    eventTime: dateStr,
                    eventTimeStr: timeStr,
                    createStr: item.createStr,
                    eventType: type,
                    zanNum: item.zanNum,
                    commentNum:item.commentNum,
                    img: img_t
                });

            });
            that.setData({
                boxList: tempArr,
                boxCount: DataMain.count
            });

            //main.render('boxList', {list: main.data})
        } else {
            common.msgShowDelay("你的数据被偷走了，下面加一个")
        }

        try{
            wx.stopPullDownRefresh()
        }catch (e){
            console.log(e);
        }
    },
    userLogin: function () {
        let that = this;
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
    getUserInfo: function () {
        let that = this;
        common.getWxUser({}, {
            func: function (response) {
                app.globalData.userInfo = response;
            },
            context: that
        })
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {
        let that = this;
        that.requestData();
    },
})

