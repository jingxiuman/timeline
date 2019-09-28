import Taro from '@tarojs/taro'
import './app.scss'
import common from './utils/util.js'

class App extends Taro.Component {
    constructor() {
        super();
        this.state = {
            platform: process.env.TARO_ENV,
        };
    }
    componentDidShow() {
        let that = this
        common.getConfig(
            {
                type: 'share'
            },
            function (res) {
                that.shareData = res
            }
        )

    }

    config = {
        debug: false,
        window: {
            navigationBarTextStyle: 'white',
            navigationBarBackgroundColor: '#fa7298',
            navigationBarTitleText: '旧时光',
            backgroundColor: '#ffffff',
            enablePullDownRefresh: true,
            backgroundTextStyle: 'dark',
            backgroundColorBottom: '#ffffff'
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
            backgroundColor: '#fff',
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
            ]
        },
        networkTimeout: {
            connectSocket: 10000,
            request: 10000,
            downloadFile: 100000,
            uploadFile: 100000
        },
        "permission": {
            'scope.userLocation': {
                desc: '该地址仅用户填写记录的位置'
            }
        }

    }
    render() {
        return null
    }
}

export default App
Taro.render(<App />, document.getElementById('app'))
