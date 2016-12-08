var common = require('../../utils/util.js');
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
        zanList:[],
        commentList:[],
        id:0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (e) {
        var that = this;
        this.setData({
            id:e.id
        });
        common.getBoxDetailByOwn({
            id: e.id
        }, {
            func: function (response) {
                var timeAll = common.formatDate(response.eventTime)
                that.setData({
                    detail: {
                        img: common.imgUrl() + (response.img == ''?'bg_1.jpg':response.img),
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
        });
        common.getBoxComment({
            id:e.id
        },{
            func:function(response){
                console.log(response);
                response && response.list &&response.list.forEach(function(item){
                    let time = new Date(item.time * 1000);
                    item.time = time.getFullYear() +'-'+(time.getMonth()+1)+'-'+time.getDate()
                }) ;
                that.setData({
                    zanLength:response && response.zan && response.zan.length,
                    zanList:response && response.zan,
                    commentList:response && response.list,
                    commentLength:response && response.list && response.list.length
                })
            },
            context:that
        })
    },
    addFavor:function () {
        var that =this;
        common.addBoxComment({
            type:0,
            id:that.data.id,
        },{
            func:function (re) {
                wx.showToast({
                    title: '点赞成功',
                    icon: 'success',
                    duration: 1500
                })
            },
            context:that
        })
    }
});

