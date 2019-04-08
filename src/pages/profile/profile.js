import {Block, View, Image, Text, Navigator} from '@tarojs/components'
import Taro from '@tarojs/taro'
import './profile.scss'
import common from './../../utils/util.js'

export default class Profile extends Taro.Component {
    state = {
        userInfo: {}
    }

    componentDidShow() {
        let that = this,
            userPic
        common.getWxUser({}, function (response) {
            if (!response.userPic) {
                userPic = common.imgDefault
            } else {
                userPic = response.userPic
            }
            that.setState({
                userInfo: {
                    userPic: userPic,
                    username: response.username,
                    eventNums: response.eventNum,
                    create_time: common
                        .moment(response.create_time * 1000)
                        .format('YYYY-MM-DD'),
                    adviceNum: response.adviceNum
                }
            })
        })
    }

    onPullDownRefresh = () => {
        try {
            Taro.stopPullDownRefresh()
        } catch (e) {
            console.log(e)
        }
    }
    config = {
        enablePullDownRefresh: false
    }

    render() {
        const {userInfo: userInfo} = this.state
        return (
            <View className="container">
                <View className="profile_container">
                    <View className="profile_bg">
                        <Image className="img" mode="scaleToFill" src={userInfo.userPic} />
                    </View>
                    <View className="profile_sq" />
                    <View className="profile_pic">
                        <Image className="img" mode="scaleToFill" src={userInfo.userPic} />
                    </View>
                </View>
                <View className="profile_name">
                    <Text>{userInfo.username}</Text>
                </View>
                <View className="profile_data">
                    <View className="profile_data_item">
                        <View className="profile_data_item_content">
                            {userInfo.eventNums}
                        </View>
                        <View className="profile_data_item_desc">EVENTS</View>
                    </View>
                    <View className="profile_data_item">
                        <View className="profile_data_item_content">
                            {userInfo.create_time}
                        </View>
                        <View className="profile_data_item_desc">CREATETIME</View>
                    </View>
                    <View className="profile_data_item">
                        <View className="profile_data_item_content">
                            {userInfo.adviceNum}
                        </View>
                        <View className="profile_data_item_desc">ADVANCE</View>
                    </View>
                </View>
                <View className="others">
                    <Navigator openType="navigate" url="../advice/advice">
                        <View className="others_item">
                            <Text>意见反馈</Text>
                            <View className="others_item_right">
                                <Image
                                    src={require('../../resources/profile/right.png')}
                                    mode="scaleToFill"
                                />
                            </View>
                        </View>
                    </Navigator>
                    {/*  <navigator open-type='navigate' url='../secure/secure'>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <view class='others_item'>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <text>用户安全</text>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <view class='others_item_right'>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <image src='../../resources/profile/right.png' mode='scaleToFill'></image>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </view>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </view>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   </navigator>  */}
                    <Navigator openType="navigate" url="../log/log">
                        <View className="others_item">
                            <Text>更新日志</Text>
                            <View className="others_item_right">
                                <Image
                                    src={require('../../resources/profile/right.png')}
                                    mode="scaleToFill"
                                />
                            </View>
                        </View>
                    </Navigator>
                </View>
            </View>
        )
    }
}

export default _C
