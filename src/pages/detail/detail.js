import {
    View,
    Image,
    Text,
    Button,
    Navigator
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./detail.scss";
import common from "../../utils/util.js";
import _ from 'lodash'

export default class Detail extends Taro.Component {
    name = "detail";
    state = {
        detail: {},
        id: 0,
        showEdit: true,
        isShare: 0,
        scene: '',
        img: [],
    };
    componentWillMount(e) {
        let {id, scene} = this.$router.params;
        id = id || scene;

        this.setState({
            id,
            isShare: false,
            scene
        });
        Taro.showLoading({title: "加载中"});
        let that = this;
        common.getBoxDetailByOwn(
            {
                id
            },
            function (response) {
                let imgA = [];
                let img = common.imgDefault;
                if (_.isArray(response.img)) {
                    response.img.forEach(function (item, index) {
                        if (item.url) {
                            let imgTmp = common.getImgUrl(item.url, 640, 360, 0);
                            if (index === 0) {
                                img = imgTmp;
                            } else {
                                imgA.push(imgTmp);
                            }
                        }
                    });
                }
                Taro.setNavigationBarTitle({
                    title: response.eventName || "旧时光详情"
                });
                that.setState({
                    detail: {
                        img,
                        eventName: response.eventName,
                        eventTime: "1472398615",
                        timeStr: common.formatTimeLine(response.eventTime, "time"),
                        timeStr2: common.formatTimeLine(response.eventTime, "day"),
                        dateStr: common.formatTimeLine(response.eventTime, "date"),
                        id: response.id,
                        address: response.address,
                        imgList: imgA,
                        created_at: response.created_at,
                        eventContent: response.eventContent
                    }
                });
                Taro.hideToast();
                if (response.isDefault || scene) {
                    that.setState({
                        showEdit: false
                    });
                }
            }
        );

    }

    onPullDownRefresh = () => {
        Taro.stopPullDownRefresh();

    };
    config = {};
    onShareAppMessage = () => {
        const {eventName: title, id, img: imgList} = this.state;
        let imageUrl = ''
        if (imgList.length > 0) {
            imageUrl = imgList[0]
        }
        return {
            title,
            path: `pages/detail/detail?id=${id}`,
            imageUrl
        }
    }
    sharePic() {
        const {id} = this.state;
        Taro.showLoading({
            title: '生成图片中'
        })
        Taro.previewImage({
            current: common.getSharePic(id), 
            urls: [common.getSharePic(id)],
        }).then(res => {
            Taro.hideLoading();
        })
        // Taro.downloadFile({
        //     url: common.getSharePic(id),
        //     success: res => {
        //         Taro.showLoading({
        //             title: '下载完成'
        //         });
        //         Taro.
        //         Taro.authorize({
        //             scope: "scope.writePhotosAlbum",
        //             success: () => {
        //                 Taro.saveImageToPhotosAlbum({
        //                     filePath: res.tempFilePath,
        //                     success: () => {
        //                         Taro.showToast({
        //                             title: '保存至相册中' ji
        //                         })
        //                     }
        //                 })
        //             }
        //         })
        //     },
        //     fail: () => {
        //         Taro.hideLoading();
        //         Taro.showToast({
        //             title: '下载失败'
        //         })
        //     }
        // })
    }
    render() {
        const {
            detail: detail,
            isShare: isShare,
            showEdit: showEdit,
            scene,
            id: id
        } = this.state;

        return (
            <View className="detail">
                <View className="detail-img-main">
                    <Image className="detail-img" mode="aspectFill" src={detail.img} />
                    <View className="detail-img-cover" />
                    <Text className="detail-time">{detail.timeStr2}</Text>
                    <Text className="detail-eventName">
                        {detail.eventName ? detail.eventName : "暂无内容"}
                    </Text>
                    <Text className="detail-eventType">dairy</Text>
                </View>
                <View className="detail-container">
                    <rich-text className="detail-content" nodes={detail.eventContent ? detail.eventContent : "暂无内容"}>
                    </rich-text>
                    {detail.imgList.map((item, index) => {
                        return (
                            <View className="detail-img-item" key="item">
                                <Image className="detail-img" mode="aspectFill" src={item} />
                            </View>
                        );
                    })}
                    {detail.address && (
                        <View className="detail-address">{"记录于" + detail.address}</View>
                    )}
                    <View className="detail-create">{detail.created_at}</View>
                </View>
                <View className="share">
                    {scene && (
                        <navigator url="/pages/index/index" hover-class="navigator-hover" className="btn">
                            <Button type="primary" size="mini" plain="true" className="btn">
                                回到首页
						</Button>
                        </navigator>
                    )}
                    {process.env.TARO_ENV === 'weapp' && <Button type="primary" size="mini" plain="true" openType="share" className="btn">
                        分享给好朋友
						</Button>}
                    {process.env.TARO_ENV === 'weapp' && <Button type="primary" size="mini" plain="true" onTap={() => this.sharePic()} className="btn">
                        下载海报图
						</Button>}
                </View>
                {showEdit && (
                    <View className="operation">
                        <Navigator
                            url={`/pages/updateBox/updateBox?id=${id}`}
                            openType="navigate"
                        >
                            <Text>编辑</Text>
                        </Navigator>
                    </View>
                )}
            </View>
        );
    }
}
