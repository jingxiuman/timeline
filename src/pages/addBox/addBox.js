import {
    Block,
    View,
    Text,
    Input,
    Picker,
    Textarea,
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
        imgList: []
    };


    formSaveData = e => {
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
                function (response, code) {
                    if (code != 0) {
                        Taro.showToast({
                            title: response.msg,
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
                    <Textarea
                        className="form-group-texterea"
                        maxlength="-1"
                        autoHeight="true"
                        name="content"
                        onInput={this.contentFunc}
                        value={detail.content || ""}
                        placeholder="记录这一刻点点滴滴"
                        // type="textarea"
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
                            );
                        })}
                        <View className="img-item">
                            <Image
                                className="img"
                                mode="scaleToFill"
                                onClick={this.choosePic}
                                src={require("../../resources/addPic.png")}
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

        );
    }
}
