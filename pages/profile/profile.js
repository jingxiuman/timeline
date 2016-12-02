

// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "profile",
  /**
   * 页面的初始数据
   */

  data: {
     userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    console.log(app.globalData);
   
    this.data.userInfo = app.globalData.userInfo;
     console.info("本页面元素",this.data)
    this.setData({
      userInfo:app.globalData.userInfo
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
    wx.stopPullDownRefresh()
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


  //以下为自定义点击事件
  
})

