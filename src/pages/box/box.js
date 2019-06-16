import { Block, ScrollView, View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./box.scss";
import common from "./../../utils/util.js";
const app = Taro.getApp();

export default class Box extends Taro.Component {
	name = "box";
	state = {
		boxList: [],
		boxCount: 0,
		baseImg: "",
		pageIndex: 1,
		pageSize: 3
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

	componentDidShow() {
		this.requestData();
	}

	requestData = () => {
		let that = this;
		const { pageSize, pageIndex } = this.state;
		common.getOwnBox(
			{
				pageSize,
				pageIndex
			},
			response => {
				that.makeData(response.data);
				console.log(res);
				this.setState({
					pageIndex: response.pageIndex,
					pageSize: response.pageSize
				});
			}
		);
	};
	makeData = res => {
		console.log("123123", res);
		const { boxList } = this.state;
		const arr = [];
		res.forEach(function(item) {
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

			boxs.forEach(function(item_box) {
				if (item_box.id == item.id) {
					flag = true;
				}
			});
			if (!flag) {
				arr.push(item);
			}
		});
		this.setState({ boxList: boxs.contact(arr) });
	};
	delBox = e => {
		console.log("long", e);
		this.isLongTap = true;
		let that = this;
		//TODO 完成删除逻辑
		Taro.showModal({
			title: "提示",
			content: "确认删除当前的事件",
			success: function(res) {
				if (res.confirm) {
					let id = e.currentTarget.dataset.id;
					common.delBoxOne(
						{
							id: id
						},
						function(res, code) {
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
	goToDetail = (e, id) => {
		console.log("tap", e);
		if (this.isLongTap) {
			this.isLongTap = false;
			return;
		}
		Taro.navigateTo({
			url: "../detail/detail?id=" + id
		});
	};
	onPullDownRefresh = () => {
		let that = this;
		that.requestData();
	};
	imgLoadError = e => {
		let index = e.target.dataset.id;
		let keyName = "boxList[" + index + "].img";
		console.log(keyName, common.defaultBg.item);
		this.setState({
			keyName: common.defaultBg.item
		});
	};
	config = {
		enablePullDownRefresh: true
	};
	onReachBottom(e) {
		console.log(e);
		const { pageSize, pageIndex } = this.state;

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
	render() {
		const { boxList: boxList } = this.state;
		return (
			<ScrollView
				className="container"
				scrollY="true"
				upperThreshold="50"
				scrollWithAnimation="true"
			>
				{boxList.map((item, indexId) => {
					return (
						<Block key="id">
							<View
								className="timeLine-item"
								onClick={e => this.goToDetail(e, item.id)}
								onLongtap={this.delBox}
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
						</Block>
					);
				})}
			</ScrollView>
		);
	}
}
