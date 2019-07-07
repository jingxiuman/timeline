import {
    Block,
    View,
    Text,
    Input,
    Picker,
    Editor,
    Image,
    Button
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./addBox.scss";
import common from "../../utils/util";
import baseBoxAdd from "../../baseComponent/baseBox";

export default class addBox extends baseBoxAdd {
    name = "addBox";
    state = {
        detail: {
            time: "",
            title: "",
            content: "",
            address: "",
            imgUrl: []
        },
        timeStr: "",
        imgList: [],
        id: ''
    };
    config = {
        enablePullDownRefresh: false
    };
    formSaveData(e) {
        console.log(e);
        var that = this;
        var detail = {
            title: that.state.detail.title,
            time: that.state.detail.time,
            content: that.state.detail.content,
            address: that.state.detail.address,
            img: that.state.detail.imgUrl
        };

        if (detail.title == "") {
            Taro.showToast({
                title: "标题不能为空"
            });
        } else {
            Taro.showLoading({title: "保存中"});
            common.addBoxDetail(
                {
                    eventName: detail.title,
                    eventTime: detail.time / 1000,
                    eventContent: detail.content,
                    eventImg: JSON.stringify(detail.img),
                    eventAddress: detail.address
                },
                function (data, code, res) {
                    if (code != 0) {
                        Taro.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 2000
                        });
                        return;
                    }
                    Taro.showToast({
                        title: "保存成功",

                        duration: 2000
                    });
                    Taro.hideToast();
                    that.setState({
                        detail: {
                            time: "",
                            title: "",
                            content: " ",
                            address: detail.address,
                            imgUrl: []
                        },
                        imgList: []
                    });
                    Taro.switchTab({
                        url: "/pages/box/box"
                    });
                }
            );
        }
    };
    render() {
        const {detail: detail, timeStr: timeStr, imgList: imgList} = this.state;
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
                                    {timeStr || "点击记录这一刻时间"}
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
                    <View className="editor-tools-container">
                        <View className="editor-tools-item" onClick={this.insertPic}>
                            <View className="iconfont">&#xe652;</View>
                        </View>
                        <View className="editor-tools-item" onClick={this.insertDivider}>
                            <View className="iconfont">&#xe6e5;</View>
                        </View>
                        <View className="right">
                            <View className="editor-tools-item" onClick={this.clearHandle}>
                                <View className="iconfont">&#xe60a;</View>
                            </View>
                            <View className="editor-tools-item" onClick={this.undoHandle}>
                                <View className="iconfont">&#xe7f4;</View>
                            </View>
                        </View>

                    </View>
                    <Editor
                        id="editor"
                        class="form-group-texterea"
                        placeholder="记录这一刻点点滴滴"
                        showImgSize
                        showImgToolbar
                        showImgResize
                        // onStatuschange={this.contentFunc}
                        onInput={this.contentFunc}
                        bindready="onEditorReady">
                    </Editor>

                </View>
                <View className="group-area">
                    <View className="">

                    </View>
                </View>
                <View className="group-area">
                    <View className="form-group-img-title">封面图片</View>
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
                                            className="img-del iconfont"
                                            onClick={this.deletePic}
                                            data-index={indexId}
                                        >
                                            &#xe641;
										</View>
                                    </View>
                                </Block>
                            );
                        })}
                        {
                            imgList.length == 0 ? <View className="img-item">
                                <Image
                                    className="img"
                                    mode="scaleToFill"
                                    onClick={this.choosePic}
                                    src={require("../../resources/addPic.png")}
                                />
                            </View> : ''
                        }

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
        );
    }
}
