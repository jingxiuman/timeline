//app.js
var common = require('utils/util.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    this.userLogin();
  },
  getUserInfo:function(){
      var that =this; 
      wx.getUserInfo({
          success: function (res) {
              console.log('wx user info',res);
              res.wx_token = wx.getStorageSync('wx_token')
              common.wxUserLogin(res,{
                func:function(response){
                  console.info('lasrt',res);
                  wx.setStorageSync('token', response.token);
                  wx.setStorageSync('info',  response.info);
                  wx.setStorageSync('userInfo', res.userInfo)
                  that.globalData.userInfo = res.userInfo
                },
                context:that
              })
          }
      })
  },
  userLogin:function(){
    var that = this,
        flag = 0; // 0代表已经注册过了 1表示没有注册登陆过
      //调用登录接口
      if(!common.checkLogin()){
          flag =1;
      }
      if(flag == 1){
          wx.login({
            success: function (res_main) {
              console.log('get code',res_main)
              common.wxUserCode({
                    code:res_main.code,
                  //  token:wx.getStorageSync('wx_token')
                  },{
                    func:function(response_code){
                      console.log('response_code',response_code)
                      wx.setStorageSync('wx_token', response_code.token);
                      that.getUserInfo()
                    },
                    context:that
                  })
            }
          })

        }else{
          if(wx.getStorageInfoSync('userInfo')==''){
            common.getWxUser({},{
              func:function(response){
                wx.setStorageSync('userInfo', response);
                that.globalData.userInfo =response;
              },
              context:that
            })
          }else{
             that.globalData.userInfo =wx.getStorageSync('userInfo');
          }
        }


  },
  globalData:{
    userInfo:null,
    imgUrl:''
  }
})
