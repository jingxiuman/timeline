let common = require('../../utils/util.js');
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
        detail: {},
        id: 0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (e) {

        this.setData({
            id: e.id,
        })

    },
    onReady(){
        let that = this;
        common.getBoxDetailByOwn({
            id: that.data.id
        }, {
            func: function (response) {
                let timeAll = common.formatDate(response.eventTime);
                that.setData({
                    detail: {
                        img: response.img ? (common.imgUrl() + response.img + '?imageView2/1/w/640/h/360') : common.baseImg(),
                        eventName: response.eventName,
                        eventTime: "1472398615",
                        type: timeAll.type,
                        timeStr: timeAll.timeStr,
                        dateStr: timeAll.dateStr,
                        id: response.id,
                        hasShare: response.idShare,
                        hasZan: response.hasZan,
                        created_at: response.created_at,
                        eventContent: response.eventContent
                    }
                })
            },
            context: that
        });
    },
    onPullDownRefresh()
    {
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
            title: that.data.detail.eventName || '旧时光',
            desc: that.data.detail.eventContent || '记录你的幸福时光',
            path: '/pages/box/box'
        }
    }
})
;

