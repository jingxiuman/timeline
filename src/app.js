import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './app.scss'
let common = require('utils/util.js')

class App extends Taro.Component {
  componentDidShow() {
    let that = this
    common.getConfig(
      {
        type: 'share'
      },
      function(res) {
        that.shareData = res
      }
    )
  }

  config = {
    debug: true,
    window: {
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#fa7298',
      navigationBarTitleText: '旧时光',
      backgroundColor: '#ffffff',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark'
    },
    pages: [
      'pages/index/index',
      'pages/error/error',
      'pages/box/box',
      'pages/addBox/addBox',
      'pages/profile/profile',
      'pages/detail/detail',
      'pages/advice/advice',
      'pages/log/log',
      'pages/updateBox/updateBox',
      'pages/secure/secure'
    ],
    tabBar: {
      color: '#fa7298',
      selectedColor: '#fa7298',
      borderStyle: 'white',
      list: [
        {
          text: '时光机',
          pagePath: 'pages/box/box',
          iconPath: 'resources/clock_none.png',
          selectedIconPath: 'resources/clock_select.png'
        },
        {
          text: '新建',
          pagePath: 'pages/addBox/addBox',
          iconPath: 'resources/add_none.png',
          selectedIconPath: 'resources/add_select.png'
        },
        {
          text: '我的',
          pagePath: 'pages/profile/profile',
          iconPath: 'resources/person_none.png',
          selectedIconPath: 'resources/person_select.png'
        }
      ],
      backgroundColor: 'rgba(255, 255, 255, 0.21)'
    },
    networkTimeout: {
        connectSocket: 10000,
        request: 10000,
        downloadFile: 10000,
        uploadFile: 10000
    }
  }

  componentWillMount() {
    this.$app.globalData = this.globalData
  }

  render() {
    return null
  }
}

export default App
Taro.render(<App />, document.getElementById('app'))
