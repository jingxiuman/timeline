import Taro from "@tarojs/taro";

export default class TitleComponent extends Taro.Component {
	render(){
		
		return (
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
		);
	}
}