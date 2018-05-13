let common = require('utils/util.js');
App({
  onShow: function() {
    let that = this;
    common.getConfig({
      type: 'share'
    }, function(res){
        that.shareData = res
    })
  }
});
