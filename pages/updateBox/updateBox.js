var common = require('../../utils/util.js');
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
    /**
     * 页面名称
     */
    name: "updateBox",
    /**
     * 页面的初始数据
     */

    data: {
        detail: {
            time: '',
            timeStr: '',
            title: '',
            content: ' ',
            address: '',
            eventType: 0, //0:纪念日 1：日记,
            imgList: [],
        },
        radioItems:[
          { name: '纪念日', value: 0},
          { name: '日记', value: 1 }
        ],
        imgList: [],
        boxId:0,
        changeArr: ['纪念日', '日记'],
        changeIndex: 0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
      console.info("url data",options)
      this.setData({
          boxId:options.id,
      })
      var that = this;
      common.getBoxDetailByOwn({
        id: that.data.boxId
      }, {
          func: function (res) {
            console.log("box detail", res);
            let response = res[0];
            wx.setNavigationBarTitle({
              title: response.eventName || '旧时光详情'
            })
            let imgObj = that.revertImg(response.img);
            let dateStr = response.eventType == 1 ? 'all':'date';
            that.setData({
              detail: {
                eventName: response.eventName,
                eventTime: response.eventTime,
                dateStr: common.formatCreate(response.eventTime, dateStr) ,
                eventContent: response.eventContent,
                eventType: response.eventType,
                id: response.id,
                address: response.address,
                imgList: imgObj.imgName,
              },
              imgList: imgObj.imgPath
            });
            let radioItems = that.data.radioItems;
            radioItems.forEach(function(item) {
              if(item.value == response.eventType){
                item.checked = true
              }
            })
            that.setData({
              radioItems: radioItems
            });
            if (!response.address) {
              that.getAddress()
            }
          },
          context: that
        })
    },
    getAddress() {
      var that = this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy;
          common.getAddress({
            lat: res.latitude,
            lng: res.longitude
          }, {
              func: function (res) {
                that.setData({
                  'detail.address': res.address.formatted_address
                })
              },
              context: that
            })
        }
      })
    },
    revertImg(img){
      let imgArr = [], imgA = [];
      img && (imgArr = img.split("-"));
      imgArr.forEach(function (item) {
        imgA.push(common.getImgUrl(item, 640, 360))
      });
      return {
        imgPath:imgA,
        imgName: imgArr
      };
    },
    titleChange: function (e) {
        var that = this;
        that.setData({
            'detail.eventName': e.detail.value
        });
    },
    contentFunc: function (e) {
        var that = this;
        that.setData({
            'detail.eventContent': e.detail.value
        })
    },
    eventTypeChange: function (e) {
        var that = this;
        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == e.detail.value;
        }
        this.setData({
          radioItems: radioItems
        });
        if (e.detail.value) {
          this.setData({
            'detail.eventType': e.detail.value == true ? 1 : 0,
            'detail.eventTime': new Date().getTime()/1000,
            'detail.dateStr': common.formatCreate(new Date().getTime() / 1000, 'all'),
          });
        } else {
          this.setData({
            'detail.eventType': e.detail.value == true ? 1 : 0,
          });
        }

    },
    formSaveData(e){
        console.log(e)
        var that = this;
        var detail = {
            title: that.data.detail.eventName,
            time: that.data.detail.eventTime,
            content: that.data.detail.eventContent,
            address: that.data.detail.address,
            eventType: that.data.detail.eventType,
            img: that.data.detail.imgList.join("-"),
            id:that.data.boxId
        };

        if (detail.title == '' || detail.time == '') {
            wx.showToast({
                title: '时间和标题是必填的！',
            })
        } else {
            wx.showLoading({title: '保存中'})
            common.updateBoxOne({
                eventName: detail.title,
                eventTime: detail.time,
                eventContent: detail.content,
                eventImg: detail.img,
                eventAddress: detail.address,
                eventType: detail.eventType,
                id:detail.id
            }, {
                func: function (response) {
                    wx.hideToast()
                    wx.showToast({
                        title: '保存成功',
                        duration: 2000
                    });
                    wx.hideToast();
                    that.setData({
                        detail: {
                            time: '',
                            timeStr: '',
                            title: '',
                            content: ' ',
                            address: '',
                            eventType: 0, //0:纪念日 1：日记,
                            imgList: [],
                        },
                        imgList: [],
                    })
                    wx.switchTab({
                        url: '/pages/box/box'
                    })
                },
                context: that
            })
        }

    },
    choosePic(){
        var that = this;
        if (this.data.detail.imgList.length < 9) {
          let pathUrl = that.data.detail.imgList || [];
          let realUrl = that.data.imgList || [];
          wx.showLoading({
              'title': '图片上传中'
          })
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var tempFilePaths = res.tempFilePaths;
                    common.addPic(tempFilePaths, {
                        func: function (response) {
                            wx.hideLoading();
                            let urlImg = common.imgUrl() + response + '?imageView2/1/w/100/h/100';
                            realUrl.push(urlImg);
                            pathUrl.push(response)
                            that.setData({
                                imgList: realUrl,
                                
                            });
                            that.setData({
                              'detail.imgList': pathUrl
                            })
                        },
                        context: that
                    })

                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: '您取消了上传图片',
                        duration: 2000
                    });
                }
            })
        } else {
            wx.showToast({
                title: '最多9张'
            })
        }
    },
    previewImage: function (e) {
        var that = this;
        let urlImg = that.data.imgList;
        let currentImg = e.currentTarget.dataset.url;
        wx.previewImage({
          current: currentImg,
          urls: urlImg, // 需要预览的图片http链接列表
          complete: function (e) {
              console.log(e);
          }
        })
    },
    delImage: function(e) {
      let that = this;
      let currentIndex = e.currentTarget.dataset.index;
      let showImgList = that.data.imgList;
      let saveImgList = that.data.detail.imgList;
      wx.showModal({
        title: '删除警告',
        content: '你确认删除当前图片么？',
        success: function (res) {
          if (res.confirm) {
            showImgList.splice(currentIndex,1);
            saveImgList.splice(currentIndex, 1);
            that.setData({ imgList: showImgList});
            that.setData({ 'detail.imgList':saveImgList})
          }
        }
      })
    },
    eventTimeChange(e){
        let eventTime = e.detail.value;
        let timeStamp = (new Date(eventTime).getTime()/1000);
        this.setData({
          'detail.eventTime': Math.floor(timeStamp)
        });
        this.setData({
          'detail.dateStr': eventTime
        })
    },
    getCurrentTime(){
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var str = year + '-' + month + '-' + day;
        return str;
    },
    onPullDownRefresh () {
        try {
            wx.stopPullDownRefresh()
        } catch (e) {
            console.log(e);
        }
    },
    //以下为自定义点击事件
    onUnload(){

    }
})

