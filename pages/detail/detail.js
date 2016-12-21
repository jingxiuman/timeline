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
        zanList:[],
        commentList:[],
        id:0,
        addCommentFlag:false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (e) {
        let that = this;
        this.setData({
            id:e.id
        });
        common.getBoxDetailByOwn({
            id: e.id
        }, {
            func: function (response) {
                let timeAll = common.formatDate(response.eventTime)
                that.setData({
                    detail: {
                        img: common.imgUrl() + (response.img == ''?'bg_1.jpg':response.img)+'?imageView2/1/w/640/h/360',
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
        that.getComment(e.id);
    },
    getComment:function (id) {
        let that =this;
        common.getBoxComment({
            id:id
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
    addCommentFunc(e) {
        this.setData({'addCommentFlag':true})
    },
    addComment (e) {
        console.log(e);
        let value = e.detail.value.main;
        let that =this;
        if(value != ''){
            common.addBoxComment({
                type:1,
                id:that.data.id,
                content:value,
            },{
                func:function (re) {
                    this.setData({
                        'addCommentFlag': false
                    });
                    that.getComment(that.data.id);
                    wx.showToast({
                        title: '评论成功',
                        icon: 'success',
                        duration: 1500
                    })
                },
                context:that
            })
        }else{
            wx.showModal({
                title:'警告',
                content:'内容必填哦～',
                showCancel:false
            })
        }
    },
    closeComment() {
        this.setData({'addCommentFlag':false})
    },
    addFavor() {
        let that =this;
        common.addBoxComment({
            type: 0,
            id:that.data.id,
        },{
            func:function (re) {
                this.setData({
                    'detail.hasZan': 1
                });
                that.getComment(that.data.id);
                wx.showToast({
                    title: '点赞成功',
                    icon: 'success',
                    duration: 1500
                })
            },
            context:that
        })
    },
    addShare() {
        let that =this;

        common.shareBox({
            type:!that.data.detail.hasShare,
            id:that.data.id,
        },{
            func:function (re) {
                if(re.type != 'other') {
                    this.setData({
                        'detail.hasShare': !that.data.detail.hasShare
                    });
                    wx.showToast({
                        title: that.data.detail.hasShare == 1 ? '分享成功' : '取消分享',
                        icon: 'success',
                        duration: 1500
                    })
                }else{
                    wx.showToast({
                        title: '这是别人的',
                        icon: 'success',
                        duration: 1500
                    })
                }
            },
            context:that
        })
    },
    onPullDownRefresh () {
        try {
            wx.stopPullDownRefresh()
        } catch (e) {
            console.log(e);
        }
    },
});

