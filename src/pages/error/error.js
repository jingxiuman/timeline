import { Block, View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './error.scss'
import common from './../../utils/util.js'

export default class Error extends Taro.Component {
  name = 'error'
  state = {}

  componentWillMount() {}

  componentDidMount() {}

  componentDidShow() {}

  createUserRandom = () => {
    common.createUser({}, function(response) {
      console.log(response)
      Taro.setStorageSync('token', response.token)
      Taro.setStorageSync('info', response.info)
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    })
  }
  bindgetuserinfo = e => {
    common.userLogin(function() {
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    })
  }
  config = {
    enablePullDownRefresh: false
  }

  render() {
    return (
      <View className="error">
        <Image
          className="bg"
          mode="aspectFit"
          src={require('../../resources/error.png')}
        />
        <View className="btn-group">
          <View className="label">点击以下才能永久保存你记录的时光</View>
          <View className="group-area">
            <View className="form-group">
              <Button
                className="userInfo"
                plain="true"
                type="primary"
                openType="getUserInfo"
                onGetuserinfo={this.bindgetuserinfo}
              >
                点击获取个人用户信息
              </Button>
            </View>
          </View>
        </View>
        <View className="btn-group">
          <View className="label">
            游客身份是临时，可能因为设备的更换等原因造成遗失
          </View>
          <View className="group-area">
            <View className="form-group">
              <View className="visitor" onClick={this.createUserRandom}>
                以游客身份登录
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
