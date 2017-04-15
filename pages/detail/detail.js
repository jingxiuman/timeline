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
    onShow(){
        wx.showLoading({title: '加载中'});
        let that = this;
        common.getBoxDetailByOwn({
            id: that.data.id
        }, {
            func: function (res) {
                let response = res[0];
                let timeAll = common.formatTimeLine(response.eventTime, 'time');
                let imgArr = [], imgA = [];
                response.img && (imgArr = response.img.split("-"));
                imgArr.forEach(function (item) {
                    console.log(item);
                    imgA.push(common.getImgUrl(item, 640, 360))
                });
                response.img = response.img ? common.getImgUrl(imgArr[0], 640, 360) : common.imgDefault;
                that.setData({
                    detail: {
                        img: response.img,
                        eventName: response.eventName,
                        eventTime: "1472398615",
                        type: timeAll.type,
                        timeStr: common.formatTimeLine(response.eventTime, 'time'),
                        dateStr: common.formatTimeLine(response.eventTime, 'date'),
                        id: response.id,
                        address: response.address,
                        imgList: imgA,
                        created_at: response.created_at,
                        eventContent: response.eventContent
                    }
                });
                wx.hideToast()
            },
            context: that
        });
    },
    onReady(){


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

