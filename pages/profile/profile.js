let common = require('../../utils/util.js');
const app = getApp();
Page({
    data: {
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad () {
        let that = this, userPic;
        common.getWxUser({}, {
            func: function (response) {
                if (!response.userPic) {
                    userPic = common.imgDefault
                } else {
                    userPic = response.userPic
                }
                this.setData({
                    userInfo: {
                        userPic: userPic,
                        username: response.username
                    }
                })
            },
            context: that
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

