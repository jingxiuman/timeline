var common = require('../../utils/util.js');
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
    /**
     * 页面名称
     */
    name: "box",
    /**
     * 页面的初始数据
     */

    data: {
        boxList: [],
        boxCount: 0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad () {
        let that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1500,

        });

        that.requestData();

    },
    requestData: function () {
        var that = this;
        common.getOwnBox({}, {
            func: function (response) {
                console.info("box 返回数据", response)
                that.makeData(response)
            },
            context: that
        })
    },
    makeData: function (DataMain) {
        var that = this, tempArr = [];
        var nowTime = new Date().getTime(), interval, type, year, day, dateStr, timeStr;
        if (DataMain.count > 0) {

            DataMain.data.forEach(function (item) {
                item.eventTime *= 1000;
                if (item.eventTime > nowTime) {
                    type = '未来';

                } else {
                    type = '过去';
                }
                interval = Math.round(Math.abs((item.eventTime - nowTime) / 86400000));


                year = parseInt(interval / 365);
                day = parseInt(interval % 365);

                var timS = item.eventTime / 1;

                var date = new Date(timS),
                    date_year = date.getFullYear(),
                    date_month = date.getMonth() + 1;

                dateStr = '距离' + date_year + '年' + date_month + '月' + date.getDate() + '日';
                if (year > 0) {
                    timeStr = year + '年' + day + '天';
                } else {
                    timeStr = day + '天';
                }
                // console.log("总共"+interval+'天'+"--"+year+'年'+day+'天,时间:'+dateStr);
                var img_t = '';
                //console.log(img_t)
                if (item.img != '') {

                    img_t = common.imgUrl() + item.img + '?imageView2/0/w/300'
                }
                tempArr.push({
                    id: item.id,
                    eventName: item.eventName,
                    eventTime: dateStr,
                    eventTimeStr: timeStr,
                    createStr: item.createStr,
                    eventType: type,
                    zanNum: item.zanNum,
                    commentNum:item.commentNum,
                    img: img_t
                });

            });
            that.setData({
                boxList: tempArr,
                boxCount: DataMain.count
            });
            //main.render('boxList', {list: main.data})
        } else {
            common.msgShowDelay("你的数据被偷走了，下面加一个")
        }
        wx.hideToast();
        try{
            wx.stopPullDownRefresh()
        }catch (e){
            console.log(e);
        }
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {
        var that = this;
        that.requestData();
    },


    //以下为自定义点击事件

})

