import {View, Button} from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import {getWxUser, cancelLover} from '../../utils/util';


export default class Lover extends Taro.Component {
    state = {
        picItem: '',
        relation: false
    }

    componentDidMount() {
        this.getUserInfo();
    }
    getUserInfo() {
        getWxUser().then(res => {
            const {data: response} = res;
            let userPic;
            if (!response.userPic) {
                userPic = common.imgDefault;
            } else {
                userPic = response.userPic;
            }
            const userInfo = {
                userPic: userPic,
                friendPic: response.friendPic,
                friendName: response.friendName,
                username: response.username,
                relation: response.relation,
                token: response.token
            }

            this.setState(userInfo);
        })
    }
    cancelLover() {
        console.log('cancel')
        Taro.showModal({
            title: '取消绑定警示！！！！',
            content: '爱情来的都不容易，三思而后行',
            success: () => {
                cancelLover().then(res => {
                    Taro.showToast({
                        'title': '取消成功',
                        icon: 'success',
                        duration: 3000
                    })
                    this.getUserInfo();
                })
            }
        })
    }

    onShareAppMessage = () => {
        const {username, token} = this.state;
        return {
            title: `${username}邀请你组成情侣`,
            path: `pages/lover/index?own=${token}`,
        }
    }
    render() {
        const {userPic, friendPic, relation, username, friendName} = this.state
        return (
            <View className="page-lover">
                <View className={`pic-container `}>
                    <View className="pic-item">
                        <Image
                            className="img"
                            mode="aspectFill"
                            src={userPic}
                        />
                    </View>
                    {relation && (
                        <View className="pic-item friend ">
                            <Image
                                className="img"
                                mode="aspectFill"
                                src={friendPic}
                            />
                        </View>
                    )}

                </View>
                <View className="username">
                    {username}
                    {relation && (<View className="iconfont icon">&#xe77a;</View>)}
                    {relation ? friendName : ''}
                </View>
                <View className="btn-container">
                    {relation && <Button type="button" size="default" onClick={this.cancelLover}>解除绑定</Button>}
                    {!relation && <Button openType="share">邀请TA</Button>}
                </View>
            </View>
        )
    }
}

