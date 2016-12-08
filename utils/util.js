
var commonFunc = {
  /**
   * ajax传送
   */
  debug:true,
  formatTime:function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  formatNumber:function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   * 检测用户是否登陆
   */
  checkLogin:function(){
    var token = wx.getStorageSync('token'),
        info = wx.getStorageSync('info');
    if(token !='' && info !=''){
        return true;
    }else{
        return false;
    }
  },
  url:function(){
    var str ='';
    if(this.debug){
        str = 'https://test.knowthis.site'
    }else{
        str = 'https://lovelog.zhouxianbao.cn'
    }
    return str;
  },
  imgUrl:function(){
    var str ='';
    if(!this.debug){
        str = 'http://7xlabr.com1.z0.glb.clouddn.com/'
    }else{
        str = 'http://ohhuk1c8m.bkt.clouddn.com/'
    }
    console.log("function nei ",str)
    return str;
  },
  formatDate:function(time){
      var nowTime = new Date().getTime(), interval, type, year, day, dateStr,timeStr;
    time *=1000;
    if (time > nowTime) {
        type = '未来';
    } else {
        type = '过去';
    }
    interval = Math.round(Math.abs((time - nowTime) / 86400000));
    year = parseInt(interval / 365);
    day = parseInt(interval % 365);
    var timS = time / 1;
    var date = new Date(timS),
    date_year = date.getFullYear(),
    date_month = date.getMonth()+1;
    dateStr = '距离' + date_year + '年' + date_month + '月' + date.getDate() + '日';
    if(year>0){
      timeStr = year+'年'+day+'天';
    }else{
      timeStr = day+'天';
    }
    return {
      dateStr:dateStr,
      timeStr:timeStr,
      type:type,
    }
  },
  /**
   * 延迟提示信息
   */
  msgShowDelay:function(response){
    wx.showToast({
            title: response.msg || 'hello',
            duration: 2000
          });
  },
  ajaxFunc:function(url,data,callback,type){
    var self =this;
      data.token=wx.getStorageSync('token');
      data.info =wx.getStorageSync('info');
    var urlStr = self.url()+url;
    console.info("url:",urlStr)
    wx.request({
      url: urlStr, //仅为示例，并非真实的接口地址
      data: data,
      method:type || 'POST',
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        var response = res.data;
        console.log("返回",response)
        if(response.code == 0){
           if (!callback) return;
            var callbackFunc = callback.func,
                callbackContext = callback.context;
            callbackFunc && typeof(callbackFunc) == 'function' && callbackFunc.call(callbackContext, response.data);
        }else{
          wx.showToast({
            title: response.msg || '',
            duration: 2000
          });
          if(response.code == 1111){
            wx.removeStorageSync('token');
             wx.removeStorageSync('info');

          }
        }

      },
      fail:function(e){
        console.error(e)
           wx.showToast({
            title: "网络连接异常",
            duration: 2000
          });
      }
    })
  },
  getBoxList:function(data,callback){
    this.ajaxFunc('/box/all',data,callback)
  },
  wxUserLogin:function(data,callback){
    this.ajaxFunc('/users/wxLogin',data,callback)
  },
   getWxUser:function(data,callback){
    this.ajaxFunc('/users/getWxUser',data,callback)
  },
  wxUserCode:function(data,callback){
    this.ajaxFunc('/users/wxCode',data,callback)
  },
  getOwnBox:function(data,callback){
    this.ajaxFunc('/box/all',data,callback)
  },
  getAllBox:function(data,callback){
    this.ajaxFunc('/box/ownAndOther',data,callback,'GET')
  },
  getBoxDetailByOwn:function(data,callback){
    this.ajaxFunc('/box/getOne',data,callback)
  },
  addPic:function(data,callback){
    var self =this;
    var urlStr = self.url()+'/pic/add';
    wx.uploadFile({
      url: urlStr, //仅为示例，非真实的接口地址
      filePath: data[0],
      name: 'img',
      formData:{
        token:wx.getStorageSync('token'),
        info :wx.getStorageSync('info')
      },
      success: function(res){
        var response = JSON.parse(res.data);
        if(response.code == 0){
           if (!callback) return;
            var callbackFunc = callback.func,
                callbackContext = callback.context;
            callbackFunc && typeof(callbackFunc) == 'function' && callbackFunc.call(callbackContext, response.data);
        }else{
          wx.showToast({
            title: response.msg ||'fail',
            duration: 2000
          });
          if(response.code == 1111){
            wx.removeStorageSync('token');
             wx.removeStorageSync('info');

          }
        }
      },
      fail:function(e){
        console.log(e)
      }
    })
  },
  addBoxDetail:function(data,callback){
    this.ajaxFunc('/box/addWxBox',data,callback)
  },
  getBoxComment:function(data,callback){
    this.ajaxFunc('/comment/boxDetail/'+data.id,{},callback,'GET')
  },
  addBoxComment:function(data,callback){
    this.ajaxFunc('/comment/add',data,callback)
  }
};

module.exports = commonFunc;
