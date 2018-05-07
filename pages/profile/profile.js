let common = require('../../utils/util.js');
const app = getApp();
Page({
    data: {
        userInfo: {}
    },

    
    onShow() {
      let that = this, userPic;
      common.getWxUser({}, function (response) {
        if (!response.userPic) {
          userPic = common.imgDefault
        } else {
          userPic = response.userPic
        }
        that.setData({
          userInfo: {
            userPic: userPic,
            username: response.username,
            eventNums: response.eventNum,
            create_time: common.moment(response.create_time*1000).format('YYYY-MM-DD'),
            adviceNum: response.adviceNum
          }
        })
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

