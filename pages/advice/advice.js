let common = require('../../utils/util.js');
Page({
    data: {
        content: '',
        list: []
    },

    onLoad () {
        let that = this;
        common.getUpdateList({}, {
            func: function (res) {
                that.setData({list: res})
            },
            context: that
        })
    },
    onShow(){

    },
    bindTextAreaBlur(e){
        let val = e.detail.value
        this.setData({content: val})
    },
    formSaveData(){
        let that = this;
        common.addAdvice({
            title: '用户反馈',
            content: this.data.content
        }, {
            func: function () {
                wx.showToast({
                    title: '感谢您的反馈！',
                });
                that.setData({content: ""});
                wx.switchTab({
                    url: '/pages/box/box'
                })
            }, content: that
        })
    }
});

