let common = require('../../utils/util.js');
Page({
    data: {
        content: '',
        list:[]
    },
    onShow() {
      this.getUserAdviceList();
    },
    getUserAdviceList() {
      let that = this;
      common.getUserAdvice({}, function (res) {
        that.setData({
          list: res || []
        })
      });
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
        }, function () {
          wx.showToast({
            title: '感谢您的反馈！',
          });
          that.setData({ content: "" });
          that.getUserAdviceList();
        })
    }
});

