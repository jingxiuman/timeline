import { Block, View, Textarea, Button, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import withWeapp from "@tarojs/with-weapp";
import "./advice.scss";
import common from "./../../utils/util.js";

export default class Advice extends Taro.Component {
	state = {
		content: "",
		list: []
	};

	componentDidShow() {
		this.getUserAdviceList();
	}

	getUserAdviceList = () => {
		let that = this;
		common.getUserAdvice({}, function(res) {
			that.setState({
				list: res || []
			});
			Taro.stopPullDownRefresh();
		});
	};
	bindTextAreaBlur = e => {
		let val = e.detail.value;
		this.setState({ content: val });
	};
	formSaveData = () => {
		let that = this;
		common.addAdvice(
			{
				title: "用户反馈",
				content: this.state.content
			},
			function() {
				Taro.showToast({
					title: "感谢您的反馈！"
				});
				that.setState({ content: "" });
				that.getUserAdviceList();
			}
		);
	};
	onPullDownRefresh = () => {
		this.getUserAdviceList();
	};

	render() {
		const { list: list } = this.state;
		return (
			<View className="main">
				<View className="group-area">
					<Textarea
						className="form-group-texterea"
						maxlength="-1"
						autoHeight="true"
						name="content"
						onInput={this.bindTextAreaBlur}
						value={this.data.content}
						placeholder="提出你美好的建议"
					/>
				</View>
				<View className="btn-group">
					<Button
						className="btn-save"
						onClick={this.formSaveData}
						hoverClass="button-hover"
						size="default"
					>
						保存
					</Button>
				</View>
				<View className="list">
					{list.map((item, indexId) => {
						return (
							<Block key="id">
								<View className="item">
									<View className="question">{item.idea_content}</View>
									{item.idea_content_return && (
										<View className="answer">
											<Text>作者答复:</Text>
											{item.idea_content_return}
										</View>
									)}
									<View className="time">{item.created_at}</View>
								</View>
							</Block>
						);
					})}
				</View>
			</View>
		);
	}
}
