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
            title: '',
            content: ' ',
        },
        imgList: '',
        imgUrl: ''
    },
    clickBTN: function () {
        console.log('点击时间')
    },
    formSaveData(e){
        console.log(e)
        var that = this;
        var detail = e.detail.value;

        if (detail.title == '' || detail.time == '') {
            wx.showModal({
                title: '警告',
                content: '时间和标题是必填的！',
                showCancel: false
            })
        } else {
            wx.showToast({
                title: '添加中',
                icon: 'loading',
                duration: 10000
            });
            common.addBoxDetail({
                eventName: detail.title,
                eventTime: new Date(detail.time).getTime() / 1000,
                eventContent: detail.content,
                img: that.data.imgUrl
            }, {
                func: function (response) {

                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000
                    });
                    wx.hideToast();
                    that.setData({
                        detail: {
                            time: '',
                            title: '',
                            content: '',
                        }
                    })
                    wx.switchTab({
                        url: '/pages/box/box'
                    })
                    // wx.redirectTo({
                    //     url: '../box/box'
                    // })
                },
                context: that
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad () {
        var time = this.getCurrentTime();
        this.setData({
            detail: {
                time: time
            }
        })

    },
    choosePic(){
        var that = this;
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
                    imgList: tempFilePaths
                });
                common.addPic(tempFilePaths, {
                    func: function (response) {
                        let urlImg = common.imgUrl() + response + '?imageView2/1/w/100/h/100';
                        console.log(response);
                        that.setData({
                            imgUrl: response
                        });

                    },
                    context: that
                })

            }
        })
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
            'detail.time': eventTime
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

})

