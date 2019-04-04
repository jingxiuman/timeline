import Taro from "@tarojs/taro";
import common from "../utils/util";

export default class baseBoxAdd extends Taro.Component {
	name = "baseBoxAdd";
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

	componentWillMount(options) {
		console.info("url data", options);
		var time = this.getCurrentTime();
		let {detail}= this.state
		detail.time = new Date().getTime()
		this.setState({
			detail,
			timeStr: time
		});
		this.getPosition();
	}

	getPosition = () => {
		var that = this;
		let data = this.state.detail;
		Taro.getLocation({
			type: "wgs84",
			success: function (res) {
				common.getAddress(
					{
						lat: res.latitude,
						lng: res.longitude
					},
					function (res) {
						data.address = res.address.formatted_address;
						that.setState({
							detail: data
						});
					}
				);
			}
		});
	};
	titleChange = e => {
		var that = this;
		let detail = this.state.detail;
		detail.title = e.detail.value
		that.setState({
			detail: detail
		});
	};
	contentFunc = e => {
		let detail = this.state.detail;
		detail.content = e.detail.value
		this.setState({
			detail: detail
		});
	};
	choosePic = () => {
		var that = this;
		let { detail, imgList } = this.state;
		let { imgUrl } = detail
		if (imgUrl.length < 9) {
			Taro.showLoading({
				title: "图片上传中"
			});
			Taro.chooseImage({
				count: 1, // 默认9
				sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
				success: function (res) {
					var tempFilePaths = res.tempFilePaths;
					common.addPic(tempFilePaths, function (response) {
						console.log(response)
						Taro.hideLoading();
						imgList.push(common.getImgUrl(response.key));
						imgUrl.push(response);
						detail.imgUrl = imgUrl;
						that.setState({
							imgList,
							detail
						});
					});
				},
				fail: function () {
					Taro.hideLoading();
					Taro.showToast({
						title: "您取消了上传图片",
						duration: 2000
					});
				}
			});
		} else {
			Taro.showToast({
				title: "最多9张"
			});
		}
	};
	seePic = e => {
		var that = this;
		let urlImg = that.state.imgList;
		let current = e.currentTarget.dataset.url;
		Taro.previewImage({
			current: current,
			urls: urlImg,
			complete: function (e) {
				console.log(e);
			}
		});
	};
	deletePic = e => {
		console.log(e);
		let index = e.currentTarget.dataset.index;
		let { imgList, detail } = this.state;
		let { imgUrl } = detail;

		imgUrl.splice(index, 1);
		imgList.splice(index, 1);
		detail.imgUrl = imgUrl
		this.setState({
			detail,
			imgList
		});
	};
	eventTimeChange = e => {
		let that = this;
		let eventTime = e.detail.value;
		let { detail } = this.state;
		detail.time = new Date(eventTime).getTime()
		this.setState({
			detail,
			timeStr: that.getCurrentTime(eventTime)

		});
	};
	getCurrentTime = timeStamps => {
		let time;
		if (timeStamps) {
			time = new Date(timeStamps);
		} else {
			time = new Date();
		}
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var day = time.getDate();
		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
		var str = year + "-" + month + "-" + day;
		return str;
	};
	config = {
		enablePullDownRefresh: false
	};

}
