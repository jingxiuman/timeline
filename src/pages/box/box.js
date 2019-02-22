import { Block, ScrollView, View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './box.scss'
let common = require('../../utils/util.js')
const app = Taro.getApp()

@withWeapp('Page')
class _C extends Taro.Component {
  name = 'box'
  state = {
    boxList: [],
    boxCount: 0,
    baseImg: ''
  }
  isLongTap = false

  componentDidMount() {
    let that = this
    that.setData({
      baseImg: common.imgDefault
    })
  }

  componentDidShow() {
    this.requestData()
  }

  requestData = () => {
    let that = this
    common.getOwnBox({}, function(response) {
      that.makeData(response)
    })
  }
  makeData = res => {
    res.forEach(function(item) {
      item.img =
        item.img.length > 0
          ? common.getImgUrl(item.img[0].url)
          : common.imgDefault
      item.eventTimeStr = common.formatTimeLine(item.eventTime, 'day')
      item.eventTimeStr2 = common.formatTimeLine(item.eventTime, 'time')
      item.eventTime = common.formatTimeLine(item.eventTime, 'date')
      item.createTime = common.formatCreate(item.created_at, 'time')
      item.createDate = common.formatCreate(item.created_at, 'date')
    })
    this.setData({ boxList: res })
  }
  delBox = e => {
    console.log('long', e)
    this.isLongTap = true
    let that = this
    //TODO 完成删除逻辑
    Taro.showModal({
      title: '提示',
      content: '确认删除当前的事件',
      success: function(res) {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id
          common.delBoxOne(
            {
              id: id
            },
            function(res, code) {
              if (code == 0) {
                that.requestData()
                Taro.showToast({
                  title: '删除成功'
                })
              } else {
                Taro.showToast({
                  title: res.msg
                })
              }
            }
          )
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    return false
  }
  goToDetail = e => {
    console.log('tap', e)
    let id = e.currentTarget.dataset.id
    if (this.isLongTap) {
      this.isLongTap = false
      return
    }
    Taro.navigateTo({
      url: '../detail/detail?id=' + id
    })
  }
  userLogin = () => {
    let that = this
    Taro.login({
      success: function(res_main) {
        common.wxUserCode(
          {
            code: res_main.code
            //  token:wx.getStorageSync('wx_token')
          },
          {
            func: function(response_code) {
              Taro.setStorageSync('wx_token', response_code.token)
              that.setUserInfo()
            },
            context: that
          }
        )
      }
    })
  }
  setUserInfo = () => {
    let that = this
    Taro.getUserInfo({
      success: function(res) {
        res.wx_token = Taro.getStorageSync('wx_token')
        console.log('wx user info', JSON.stringify(res))
        common.wxUserLogin(res, {
          func: function(response) {
            Taro.setStorageSync('token', response.token)
            Taro.setStorageSync('info', response.info)
            app.globalData.userInfo = res.userInfo
            that.requestData()
          },
          context: that
        })
      },
      fail: function(e) {
        common.createUser(
          {},
          {
            func: function(response) {
              Taro.setStorageSync('token', response.token)
              Taro.setStorageSync('info', response.info)
              app.globalData.userInfo = response.userInfo
              that.requestData()
            }
          }
        )
      }
    })
  }
  onPullDownRefresh = () => {
    let that = this
    that.requestData()
  }
  imgLoadError = e => {
    let index = e.target.dataset.id
    let keyName = 'boxList[' + index + '].img'
    console.log(keyName, common.defaultBg.item)
    this.setData({
      keyName: common.defaultBg.item
    })
  }
  config = {
    enablePullDownRefresh: true
  }

  render() {
    const { boxList: boxList } = this.state
    return (
      <ScrollView
        className="container"
        scrollY="true"
        upperThreshold="50"
        scrollWithAnimation="true"
      >
        {boxList.map((item, indexId) => {
          return (
            <Block key="id">
              <View
                className="timeLine-item"
                data-id={item.id}
                onClick={this.goToDetail}
                onLongtap={this.delBox}
              >
                <View className="timeLine-img">
                  <Image
                    className="img"
                    mode="aspectFill"
                    onError={this.imgLoadError}
                    data-id={indexId}
                    src={item.img}
                  />
                </View>
                <View className="timeLine-content">
                  <View className="timeLine-title">{item.eventName}</View>
                  <View className="timeLine-date">
                    <View className="timeLine-day">{item.eventTimeStr}</View>
                    <View className="timeLine-time">{item.eventTime}</View>
                  </View>
                </View>
              </View>
            </Block>
          )
        })}
      </ScrollView>
    )
  }
}

export default _C
