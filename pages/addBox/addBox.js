
var common = require('../../utils/util.js');
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "addBox",
  /**
   * 页面的初始数据
   */

  data: {
    detail:{
      time:'',
      title:'',
      content:'',
    },
    imgList:'',
    imgUrl:''
  },
  formSaveData:function(e){
    console.log(e)
    var that =this;
    var detail = e.detail.value;

    if(detail.title == '' || detail.time == ''){
      wx.showModal({
        title:'警告',
        content:'时间和标题是必填的！',
        showCancel:false
      })
    }else{
        wx.showToast({
            title: '添加中',
            icon: 'loading',
            duration: 10000
        });
      common.addBoxDetail({
        eventName:detail.title,
        eventTime:new Date(detail.time).getTime()/1000,
        eventContent:detail.content,
        img:that.data.imgUrl
      },{
        func:function(response){
            wx.hideToast();
            wx.navigateTo({
              url:'../box/box'
            })
        },
        context:that
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    var time =  this.getCurrentTime();
    this.setData({
      detail:{
        time:time
      }
    })
   
  },
  choosePic:function(){
    var that =this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //this.data.imgList.push(tempFilePaths[0])
        //console.log(this.data);
        that.setData({
          imgList:tempFilePaths[0]
        });
        common.addPic(tempFilePaths,{
          func:function(response){
              console.log(response);
              that.setData({
                imgUrl:response
              })
          },
          context:that
        })
       
      }
    })
  },
    previewPic(){
    var that =this;
    console.log("ad");
    wx.previewImage({
      current: that.imgList, // 当前显示图片的http链接
      urls: [that.imgList] // 需要预览的图片http链接列表
    })
  },
  getCurrentTime:function(){
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var day = time.getDate();
    var str = year+'-'+month+'-'+day;
    return str;
  },

  //以下为自定义点击事件
  
})

