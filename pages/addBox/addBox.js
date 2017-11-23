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
        detail: {
            time: '',
            timeStr: '',
            title: '',
            content: ' ',
            address: '',
            eventType: 0, //0:纪念日 1：日记,
            imgUrl: [],
        },
        imgList: [],
        changeArr: ['纪念日', '日记'],
        changeIndex: 0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
      console.info("url data",options)
        var time = this.getCurrentTime();
        this.setData({
            detail: {
                time: new Date().getTime(),
                timeStr: time,
                eventType: 0,
                title: '',
                content: ' ',
                address: '',
                imgUrl: [],
            },
            imgList: []
        })

    },
    onShow(){
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy;
                console.log(res)
                common.getAddress({
                    lat: res.latitude,
                    lng: res.longitude
                }, {
                    func: function (res) {
                        this.setData({
                            'detail.address': res.address.formatted_address
                        })
                    },
                    context: that
                })
            }
        })
    },
    titleChange: function (e) {
        var that = this;
        that.setData({
            'detail.title': e.detail.value
        });
    },
    contentFunc: function (e) {
        var that = this;
        that.setData({
            'detail.content': e.detail.value
        })
    },
    eventTypeChange: function (e) {
        console.log(e.detail.value);
        var that = this;
        this.setData({
            'detail': {
                eventType: e.detail.value == true ? 1 : 0,
                timeStr: common.formatCreate(new Date().getTime() / 1000, 'all'),
                time: new Date().getTime(),
                title: this.data.detail.title,
                content: this.data.detail.content,
                address: this.data.detail.address,
                imgUrl: [],
            }
        });

    },
    formSaveData(e){
        console.log(e)
        var that = this;
        var detail = {
            title: that.data.detail.title,
            time: that.data.detail.time,
            content: that.data.detail.content,
            address: that.data.detail.address,
            eventType: that.data.detail.eventType,
            img: that.data.detail.imgUrl.join("-")
        };

        if (detail.title == '' || detail.time == '') {
            wx.showToast({
                title: '时间和标题是必填的！',
            })
        } else {
            wx.showLoading({title: '保存中'})
            common.addBoxDetail({
                eventName: detail.title,
                eventTime: detail.time / 1000,
                eventContent: detail.content,
                eventImg: detail.img,
                eventAddress: detail.address,
                eventType: detail.eventType
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
                            imgUrl: [],
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
        if (this.data.detail.imgUrl.length < 9) {
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
                            console.log(response);
                            let realUrl = this.data.imgList;
                            realUrl.push(urlImg);
                            let pathUrl = this.data.detail.imgUrl;
                            pathUrl.push(response)
                            that.setData({
                                imgList: realUrl
                            });
                            that.setData({
                                'detail.imgUrl': pathUrl
                            });

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
    seePic: function () {
        var that = this;
        console.log("ad");
        let urlImg = common.imgUrl() + that.data.imgUrl;
        wx.previewImage({
            urls: [urlImg], // 需要预览的图片http链接列表
            complete: function (e) {
                console.log(e);
            }
        })
    },
    eventTimeChange(e){
        let eventTime = e.detail.value;
        this.setData({
            'detail.time': new Date(eventTime).getTime()
        });
        this.setData({
            'detail.timeStr': eventTime
        })
        console.log(e)
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

