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
import "./updateBox.scss";
import baseBoxAdd from "../../baseComponent/baseBox";
import common from "../../utils/util";

export default class updateBox extends baseBoxAdd {
	name = "updateBox";
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
		id: 0,
		isUpload: false
	};

	componentWillMount(options) {
		let id = this.$router.params.id;
		this.setState({
			id
		});
	}

	componentDidShow() {
		let {isUpload} = this.state
		if (!isUpload) {
			this.getBoxDetail();
		} else {
			this.setState({
				isUpload: false
			});
		}
	}

	getBoxDetail = () => {
		let that = this;
		let {id} = this.state
		common.getBoxDetailByOwn(
			{
				id
			},
			function(response) {
				console.log(response);
				let imgList = [];
				let imgUrl = [];
				response.img.map(function(item) {
					imgUrl.push({
						key: item.url,
						hash: item.hash
					});
					imgList.push(common.getImgUrl(item.url));
				});

				that.setState({
					detail: {
						time: response.eventTime * 1000,
						title: response.eventName,
						content: response.eventContent,
						address: response.address,
						imgUrl: imgUrl
					},
					timeStr: that.getCurrentTime(response.eventTIme),
					imgList: imgList
				});
			}
		);
	};
	formSaveData = e => {
		console.log(e);
		var that = this;
		let {detail, id} = this.state
		var newDetail = {
			title: detail.title,
			time: detail.time,
			content: detail.content,
			address: detail.address,
			img: detail.imgUrl,
			id: id
		};

		if (newDetail.title == "") {
			Taro.showToast({
				title: "标题不能为空"
			});
		} else {
			Taro.showLoading({ title: "保存中" });
			common.updateBoxOne(
				{
					eventName: newDetail.title,
					eventTime: newDetail.time / 1000,
					eventContent: newDetail.content,
					eventImg: JSON.stringify(newDetail.img),
					eventAddress: newDetail.address,
					id: newDetail.id
				},
				function(response, code) {
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
							address: "",
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
		const { detail: detail, timeStr: timeStr, imgList: imgList } = this.state;
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
