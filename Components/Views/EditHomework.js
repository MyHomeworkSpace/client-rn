import React from 'react';
import { View, KeyboardAvoidingView, AsyncStorage, Button, TextInput, Picker, StyleSheet, Text, Switch, ScrollView } from 'react-native';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import Loading from '../Loading.js'
import moment from 'moment';
import api from '../../api'

const IoniconsHeaderButton = passMeFurther => (
	<HeaderButton {...passMeFurther} IconComponent={Icon} iconSize={23} />
);

class EditHomework extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "Assignment Details",
			headerRight: (
				<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
					<Item title="Save" onPress={navigation.getParam('save')} />
				</HeaderButtons>
			),
		}
	};

	componentDidMount() {
		this.props.navigation.setParams({ save: this.save.bind(this) });
	}

	checkParams() {
		if (this.state.name == null || this.state.name.length == 0) return "Empty Name";
		else if (this.state.name.due == null) return "Date not set";
		else if (this.state.classId == null) return "Class not set";
		else return true;
	}


	async save() {
		const method = this.state.new ? "add" : "edit";
		// const check = this.checkParams();
		//if(check != true) {
		//	this.state.error = check;
		//} else {
		if (!this.state.classId || this.state.classId == -1) {
			alert("You must select a class.")
		}
		body = {
			name: this.state.name,
			due: moment(this.state.due).format("YYYY-MM-DD"),
			desc: this.state.desc,
			complete: (this.state.complete ? 1 : 0),
			classId: this.state.classId,
		}
		if (!this.state.new) {
			body.id = this.state.id
		}
		let text = await api.POST(`homework/${method}`, body)
		if (text.status == "error") {
			this.setState({ error: text.error })
		} else {
			this.state.refresh()
			this.props.navigation.goBack()
		}
		//}
	}

	encodeFormBody(body) {
		let formBody = [];
		for (const property in body) {
			const encodedKey = encodeURIComponent(property);
			const encodedValue = encodeURIComponent(body[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		return formBody.join("&");
	}

	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state;
		let state = {
			new: true
		}
		if (params.homework) {
			state = params.homework;
			state.new = false
		}
		state.refresh = params.refresh;
		state.complete = (state.complete == 1 ? true : false)
		state.loading = true;
		this.state = state;
		this.load();
	}

	async load() {
		const text = await api.GET("classes/get")
		this.setState({
			loading: false,
			classes: text.classes
		})
	}

	render() {
		if (!this.state.loading) {
			return (<ScrollView style={{ flex: 1, flexDirection: "column" }}>
				{this.state.error ? <Text style={styles.Error}>{this.state.error}</Text> : null}
				<TextInput
					placeholder="Assignment Name"
					value={this.state.name}
					onChangeText={(text) => this.setState({ name: text, changed: true })}
					style={styles.input}
				/>
				<View style={[[styles.inputWrapper, styles.inputWrapperFixedHeight], styles.topInput]}>
					<View style={styles.labelWrapper}>
						<Text style={styles.label}>Due</Text>
					</View>
					<View style={styles.labelWrapper}>
						<Button onPress={() => this.setState({ showingDueDatePicker: true })}
							title={
								this.state.due
									? moment(this.state.due).format("ddd, MMM Do")
									: "Set..."}
						/>
					</View>
					<DateTimePicker
						isVisible={this.state.showingDueDatePicker}
						onConfirm={(date) => {
							this.setState({
								due: date,
								showingDueDatePicker: false,
							})
						}}
						onCancel={() => this.setState({ showingDueDatePicker: false })}
					/>
				</View>
				<View style={[styles.inputWrapper, styles.inputWrapperFixedHeight]}>
					<View style={styles.labelWrapper}><Text style={styles.label}>Done?</Text></View>
					<Switch
						onValueChange={(value) => this.setState({ complete: value })}
						value={this.state.complete} />
				</View>
				<Picker
					selectedValue={this.state.classId}
					onValueChange={(itemValue, itemIndex) => this.setState({ classId: itemValue })}
				// style={{borderBottomWidth: 1, borderBottomColor: "#cccccc"}}
				>
					<Picker.Item label="Select a class..." value={-1} />
					{this.state.classes.map((classItem, i) => {
						return <Picker.Item label={classItem.name} value={classItem.id} key={"classitem_" + i} />
					})}
				</Picker>
				<TextInput
					placeholder="Description"
					value={this.state.desc}
					onChangeText={(text) => this.setState({ desc: text })}
					style={[styles.input, styles.multiline, { paddingBottom: 20 }]}
					multiline={true}
				/>
				<Button
					title="Delete assignment"
					color="red"
					onPress={async () => {
						this.deleteAssignment()
					}} />
			</ScrollView>);
		} else return <Loading />
	}
}

const styles = StyleSheet.create({
	input: {
		// height: 50,
		fontSize: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
	multiline: {
		textAlignVertical: 'top'
	},
	Error: {
		color: "red",
	},
	topInput: {
		borderTopWidth: 1,
		borderTopColor: "#cccccc",
	},
	inputWrapper: {
		flexDirection: "row",
		width: "100%",
		justifyContent: 'space-between',
		paddingLeft: 10,
		paddingRight: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#cccccc",
	},
	inputWrapperFixedHeight: {
		height: 40,
	},
	center: {
		justifyContent: 'center'
	},
	labelWrapper: {
		justifyContent: 'center'
	},
	label: {
		fontSize: 20
	}
})

export default EditHomework;