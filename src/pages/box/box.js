import {ScrollView, View, Image} from "@tarojs/components";
import Taro, {Component} from "@tarojs/taro";
import "./box.scss";
import common from "./../../utils/util.js";

const defaultPageSize = 10;

export default class Box extends Component {
    name = "box";
    state = {
        boxList: [],
        boxCount: 0,
        baseImg: "",
        pageIndex: 1,
        pageSize: defaultPageSize,
        orderBy: 'count',
        orderSort: 0 //0:desc 1"asc
    };
    isLongTap = false;

    componentDidMount() {
        let that = this;
        that.setState({
            baseImg: common.imgDefault
        });
        common.checkLogin(
            () => {},
            () => {
                common.setUserInfo(() => {
                    this.requestData();
                });
            }
        );
    }
    imgLoadError = e => {
        let index = e.target.dataset.id;
        let keyName = "boxList[" + index + "].img";
        console.log(keyName, common.defaultBg.item);
        this.setState({
            keyName: common.defaultBg.item
        });
    };
    delBox = (e) => {
        console.log("long", e);
        this.isLongTap = true;
        let that = this;
        let id = e.currentTarget.dataset.id;
        //TODO 完成删除逻辑
        Taro.showModal({
            title: "提示",
            content: "确认删除当前的事件",
            success: function (res) {
                if (res.confirm) {
                    common.delBoxOne(
                        {
                            id: id
                        },
                        function (res, code) {
                            if (code == 0) {
                                that.requestData();
                                Taro.showToast({
                                    title: "删除成功"
                                });
                            } else {
                                Taro.showToast({
                                    title: res.msg
                                });
                            }
                        }
                    );
                } else if (res.cancel) {
                    console.log("用户点击取消");
                }
            }
        });
        return false;
    };
    goToDetail = (e) => {
        console.log("tap", e);
        let id = e.currentTarget.dataset.id;
        if (this.isLongTap) {
            this.isLongTap = false;
            return;
        }
        Taro.navigateTo({
            url: "../detail/detail?id=" + id
        });
    };

    componentDidShow() {
        this.requestData();
    }

    requestData = () => {
        const {pageSize, pageIndex, orderBy, orderSort} = this.state;

        common.getOwnBox(
            {
                pageSize,
                pageIndex,
                orderBy,
                orderSort: (orderSort == 0 ? 'desc' : 'asc')
            },
            response => {
                this.makeData(response.data);
                this.setState({
                    pageIndex: response.pageIndex,
                    pageSize: response.pageSize
                });
                // if (process.env.TARO_ENV === "swan") {
                //     swan.stopPullDownRefresh();
                // }

            }
        );
    };
    makeData = list => {
        const {boxList = []} = this.state;
        list.forEach(function (item) {
            item.img =
                item.img.length > 0
                    ? common.getImgUrl(item.img[0].url)
                    : common.imgDefault;
            item.eventTimeStr = common.formatTimeLine(item.eventTime, "day");
            item.eventTimeStr2 = common.formatTimeLine(item.eventTime, "time");
            item.eventTime = common.formatTimeLine(item.eventTime, "date");
            item.createTime = common.formatCreate(item.created_at, "time");
            item.createDate = common.formatCreate(item.created_at, "date");
            let flag = false;

            boxList.forEach(function (item_box) {
                if (item_box.id == item.id) {
                    flag = true;
                }
            });
            if (!flag) {
                boxList.push(item);
            }
        });

        this.setState({boxList});
    };


    onPullDownRefresh = () => {
        let that = this;
        this.setState({
            pageSize: defaultPageSize, pageIndex: 1,
            boxList: []
        }, () => {
            that.requestData();
        })
    };

    config = {
        enablePullDownRefresh: false
    };
    onReachBottom(e) {
        const {pageSize, pageIndex} = this.state;

        this.setState(
            {
                pageIndex: pageIndex + 1,
                pageSize
            },
            () => {
                this.requestData();
            }
        );
    }
    changeNavHandle = (newOrderBy) => {
        let {orderSort, orderBy} = this.state;
        if (newOrderBy != orderBy) {
            orderSort = 0
        } else {
            orderSort = !orderSort
        }

        this.setState({
            orderBy: newOrderBy,
            orderSort: orderSort,
            pageIndex: 1,
            pageSize: defaultPageSize,
            boxList: []
        }, () => {
            this.requestData()
        })
    }
    render() {
        const {boxList, orderSort, orderBy} = this.state;

        const sortDom = orderSort == 0 ? <View className="iconfont icon-down">&#xe6a1;</View> : <View className="iconfont icon-up">&#xe751;</View>
        return (
            <View>
                <View className="operate-container">
                    <View className={`operate-item ${orderBy == 'create' ? 'active' : ''}`} onClick={e => this.changeNavHandle('create')}>
                        发布时间
                        {sortDom}
                    </View>
                    <View className={`operate-item ${orderBy == 'count' ? 'active' : ''}`} onClick={e => this.changeNavHandle('count')}>倒计日
                      {sortDom}
                    </View>
                    <View className="iconfont icon-refresh" onClick={e => this.onPullDownRefresh()}>&#xe631;</View>
                </View>
                <ScrollView
                    className="container"
                    scrollY="true"
                    upperThreshold="50"
                    scrollWithAnimation="true"
                    enableBackToTop="true"
                    scrollWithAnimation="true"
                >
                    {boxList.map((item) => {
                        return (
                            <View
                                className="timeLine-item"
                                data-id={item.id}
                                onTap={this.goToDetail}
                                onLongtap={this.delBox}
                                key={item.id}
                            >
                                <View className="timeLine-img">
                                    <Image
                                        className="img"
                                        mode="aspectFill"
                                        onError={this.imgLoadError}
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
                        );
                    })}
                </ScrollView>

            </View>
        );
    }
}
