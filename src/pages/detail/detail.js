import { Block, View, Image, Text, Button, Navigator } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './detail.scss'
import common from './../../utils/util.js'

export default class Detail extends Taro.Component {
  name = 'detail'
  state = {
    detail: {},
    id: 0,
    showEdit: true,
    isShare: 0
  }
  componentWillMount(e) {
	let  id = this.$router.params.id;
    this.setState({
      id,
      isShare: false
    })
	  Taro.showLoading({ title: '加载中' })
	  let that = this
	  common.getBoxDetailByOwn(
		  {
			  id
		  },
		  function (response) {
			  let timeAll = common.formatTimeLine(response.eventTime, 'time')
			  let imgA = []
			  let img = ''
			  response.img.forEach(function (item, index) {
				  if (item.url) {
					  let imgTmp = common.getImgUrl(item.url, 640, 360, 0)
					  if (index === 0) {
						  img = imgTmp
					  } else {
						  imgA.push(imgTmp)
					  }
				  }
			  })
			  Taro.setNavigationBarTitle({
				  title: response.eventName || '旧时光详情'
			  })
			  that.setState({
				  detail: {
					  img: img,
					  eventName: response.eventName,
					  eventTime: '1472398615',
					  timeStr: common.formatTimeLine(response.eventTime, 'time'),
					  timeStr2: common.formatTimeLine(response.eventTime, 'day'),
					  dateStr: common.formatTimeLine(response.eventTime, 'date'),
					  id: response.id,
					  address: response.address,
					  imgList: imgA,
					  created_at: response.created_at,
					  eventContent: response.eventContent
				  }
			  })
			  Taro.hideToast()
			  if (response.isDefault) {
				  that.setData({
					  showEdit: false
				  })
			  }
		  }
	  )
  }

  onPullDownRefresh = () => {
    try {
      Taro.stopPullDownRefresh()
    } catch (e) {
      console.log(e)
    }
  }
  config = {}

  render() {
    const {
      detail: detail,
      isShare: isShare,
      showEdit: showEdit,
      id: id
    } = this.state
    return (
      <View className="detail">
        <View className="detail-img-main">
          <Image className="detail-img" mode="aspectFill" src={detail.img} />
          <View className="detail-img-cover" />
          <Text className="detail-time">{detail.timeStr2}</Text>
          <Text className="detail-eventName">
            {detail.eventName ? detail.eventName : '暂无内容'}
          </Text>
          <Text className="detail-eventType">dairy</Text>
        </View>
        <View className="detail-container">
          <View className="detail-content">
            {detail.eventContent ? detail.eventContent : '暂无内容'}
          </View>
          {detail.imgList.map((item, index) => {
            return (
              <View className="detail-img-item" key="item">
                <Image className="detail-img" mode="aspectFill" src={item} />
              </View>
            )
          })}
          {detail.address && (
            <View className="detail-address">{'记录于' + detail.address}</View>
          )}
          <View className="detail-create">{detail.created_at}</View>
        </View>
        {isShare && (
          <View className="share">
            <Button type="primary" size="mini" plain="true" openType="share">
              分享给好朋友
            </Button>
          </View>
        )}
        {showEdit && (
          <View className="operation">
            <Navigator
              url={'/pages/updateBox/updateBox?id=' + id}
              openType="navigate"
            >
              <Text>编辑</Text>
            </Navigator>
          </View>
        )}
      </View>
    )
  }
}
