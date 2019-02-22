import {
  Block,
  View,
  Text,
  Input,
  Picker,
  Textarea,
  Image,
  Button
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './updateBox.scss'
var common = require('../../utils/util.js')

@withWeapp('Page')
class _C extends Taro.Component {
  name = 'updateBox'
  state = {
    detail: {
      time: '',
      title: '',
      content: '',
      address: '',
      imgUrl: []
    },
    timeStr: '',
    imgList: [],
    id: 0,
    isUpload: false
  }

  componentWillMount(options) {
    console.info('url data', options)
    this.setData({
      id: options.id
    })
  }

  componentDidShow() {
    if (!this.data.isUpload) {
      this.getBoxDetail()
    } else {
      this.setData({
        isUpload: false
      })
    }
  }

  getBoxDetail = () => {
    let that = this
    common.getBoxDetailByOwn(
      {
        id: that.data.id
      },
      function(response) {
        console.log(response)
        let imgList = []
        let imgUrl = []
        response.img.map(function(item) {
          imgUrl.push({
            key: item.url,
            hash: item.hash
          })
          imgList.push(common.getImgUrl(item.url))
        })

        that.setData({
          detail: {
            time: response.eventTime * 1000,
            title: response.eventName,
            content: response.eventContent,
            address: response.address,
            imgUrl: imgUrl
          },
          timeStr: that.getCurrentTime(response.eventTIme),
          imgList: imgList
        })
      }
    )
  }
  titleChange = e => {
    var that = this
    that.setData({
      'detail.title': e.detail.value
    })
  }
  contentFunc = e => {
    this.setData({
      'detail.content': e.detail.value
    })
  }
  formSaveData = e => {
    console.log(e)
    var that = this
    var detail = {
      title: that.data.detail.title,
      time: that.data.detail.time,
      content: that.data.detail.content,
      address: that.data.detail.address,
      img: that.data.detail.imgUrl,
      id: that.data.id
    }

    if (detail.title == '') {
      Taro.showToast({
        title: '标题不能为空'
      })
    } else {
      Taro.showLoading({ title: '保存中' })
      common.updateBoxOne(
        {
          eventName: detail.title,
          eventTime: detail.time / 1000,
          eventContent: detail.content,
          eventImg: JSON.stringify(detail.img),
          eventAddress: detail.address,
          id: detail.id
        },
        function(response, code) {
          Taro.showToast({
            title: '保存成功',
            duration: 2000
          })
          Taro.hideToast()
          that.setData({
            detail: {
              time: '',
              title: '',
              content: ' ',
              address: '',
              imgUrl: []
            },
            imgList: []
          })
          Taro.switchTab({
            url: '/pages/box/box'
          })
        }
      )
    }
  }
  choosePic = () => {
    var that = this
    if (this.data.detail.imgUrl.length < 9) {
      Taro.showLoading({
        title: '图片上传中'
      })
      that.setData({
        isUpload: true
      })
      Taro.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          common.addPic(tempFilePaths, function(response) {
            Taro.hideLoading()
            let realUrl = that.data.imgList
            realUrl.push(common.getImgUrl(response.key))
            let pathUrl = that.data.detail.imgUrl
            pathUrl.push(response)
            that.setData({
              imgList: realUrl,
              'detail.imgUrl': pathUrl
            })
          })
        },
        fail: function() {
          Taro.hideLoading()
          Taro.showToast({
            title: '您取消了上传图片',
            duration: 2000
          })
        }
      })
    } else {
      Taro.showToast({
        title: '最多9张'
      })
    }
  }
  seePic = e => {
    var that = this
    let urlImg = that.data.imgList
    let current = e.currentTarget.dataset.url
    Taro.previewImage({
      current: current,
      urls: urlImg,
      complete: function(e) {
        console.log(e)
      }
    })
  }
  deletePic = e => {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let imgUrl = this.data.detail.imgUrl
    let imgList = this.data.imgList
    imgUrl.splice(index, 1)
    imgList.splice(index, 1)
    this.setData({
      'detail.imgUrl': imgUrl,
      imgList: imgList
    })
  }
  eventTimeChange = e => {
    let that = this
    let eventTime = e.detail.value
    this.setData({
      'detail.time': new Date(eventTime).getTime()
    })
    this.setData({
      timeStr: that.getCurrentTime(eventTime)
    })
  }
  getCurrentTime = timeStamps => {
    let time
    if (timeStamps) {
      time = new Date(timeStamps)
    } else {
      time = new Date()
    }
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var day = time.getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    var str = year + '-' + month + '-' + day
    return str
  }
  config = {}

  render() {
    const { detail: detail, timeStr: timeStr, imgList: imgList } = this.state
    return (
      <View className="container">
        <View className="group-area">
          <View className="form-group">
            <View className="form-group-label">
              <Text className="form-group-title">标题</Text>
            </View>
            <View className="form-group-input-container">
              <Input
                className="form-group-input"
                onInput={this.titleChange}
                placeholder="总结一下这一刻"
                value={detail.title}
                type="text"
              />
            </View>
          </View>
        </View>
        <View className="group-area">
          <View className="form-group">
            <View className="form-group-label">
              <Text className="form-group-title">时间</Text>
            </View>
            <View className="form-group-input-container">
              <Picker
                mode="date"
                value={timeStr}
                name="time"
                className="eventTime form-group-input"
                onChange={this.eventTimeChange}
              >
                <View className="picker">
                  {timeStr || '点击记录这一刻时间'}
                </View>
              </Picker>
            </View>
          </View>
          <View className="form-group">
            <View className="form-group-label">
              <Text className="form-group-title">位置</Text>
            </View>
            <View className="form-group-input-container">{detail.address}</View>
          </View>
        </View>
        <View className="group-area">
          <Textarea
            className="form-group-texterea"
            maxlength="-1"
            autoHeight="true"
            name="content"
            onInput={this.contentFunc}
            value={detail.content || ''}
            placeholder="记录这一刻点点滴滴"
            type="textarea"
          />
        </View>
        <View className="group-area">
          <View className="form-group-img-list">
            {imgList.map((item, indexId) => {
              return (
                <Block key="*this">
                  <View className="img-item">
                    <Image
                      className="img"
                      onClick={this.seePic}
                      data-url={item}
                      mode="scaleToFill"
                      src={item}
                    />
                    <View
                      className="img-del"
                      onClick={this.deletePic}
                      data-index={indexId}
                    >
                      X
                    </View>
                  </View>
                </Block>
              )
            })}
            <View className="img-item">
              <Image
                className="img"
                mode="scaleToFill"
                onClick={this.choosePic}
                src={require('../../resources/addPic.png')}
              />
            </View>
            <View className="clearfix" />
          </View>
        </View>
        <View className="btn-group group-area">
          <Button
            className="btn-save"
            onClick={this.formSaveData}
            size="default"
          >
            保存
          </Button>
        </View>
      </View>
    )
  }
}

export default _C
