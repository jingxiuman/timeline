import { Block, ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './log.scss'
let common = require('../../utils/util.js')
// pages/log/log.js

@withWeapp('Page')
class _C extends Taro.Component {
  state = {
    list: []
  }

  componentDidShow() {
    this.getList()
  }

  getList = () => {
    let that = this
    common.getUpdateList({}, function(res) {
      that.setData({ list: res })
      Taro.stopPullDownRefresh()
    })
  }
  onPullDownRefresh = () => {
    this.getList()
  }
  config = {}

  render() {
    const { list: list } = this.state
    return (
      <ScrollView className="log" scrollY="true">
        {list.map((item, indexId) => {
          return (
            <Block key="id">
              <View className="log-item">
                <View className="log-title">{item.time + '更新日志'}</View>
                <View className="log-content">{item.content}</View>
              </View>
            </Block>
          )
        })}
      </ScrollView>
    )
  }
}

export default _C
