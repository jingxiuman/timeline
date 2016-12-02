var common = require('../../utils/util.js');

// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
    /**
     * 页面名称
     */
    name: "detail",
    /**
     * 页面的初始数据
     */

    data: {
        detail: {}

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (e) {
        var that = this;
        // 注册coolsite360交互模块
        console.log('detail的参数', e);
        common.getBoxDetailByOwn({
            id: e.id
        }, {
            func: function (response) {
                var timeAll = common.formatDate(response.eventTime)
                that.setData({
                    detail: {
                        img: common.imgUrl() + response.img,
                        eventName: response.eventName,
                        eventTime: "1472398615",
                        type: timeAll.type,
                        timeStr: timeAll.timeStr,
                        dateStr: timeAll.dateStr,
                        id: response.id,
                        created_at: response.created_at,
                        eventContent: response.eventContent
                    }
                })
            },
            context: that
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },


    //以下为自定义点击事件

    tap_3013baf2: function (e) {
        //触发coolsite360交互事件
        coolsite360.fireEvent(e, this);
    },

    tap_d6c84484: function (e) {
        //触发coolsite360交互事件
        coolsite360.fireEvent(e, this);
    },

    tap_e2bd485d: function (e) {
        //触发coolsite360交互事件
        coolsite360.fireEvent(e, this);
    },

    tap_3ec69114: function (e) {
        //触发coolsite360交互事件
        coolsite360.fireEvent(e, this);
    },

    tap_22930b74: function (e) {
        //触发coolsite360交互事件
        coolsite360.fireEvent(e, this);
    },

})
