import React from 'react';
import { KeyboardAvoidingView, AsyncStorage, Button, TextInput, Picker, StyleSheet, Text, Switch } from 'react-native';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import Loading from '../Loading.js'
import moment from 'moment';

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


	save() {
		const method = this.state.new ? "add" : "edit";
		// const check = this.checkParams();
		//if(check != true) {
		//	this.state.error = check;
		//} else {
		AsyncStorage.getItem('csrfToken').then((token) => {
			fetch(`https://api-v2.myhomework.space/homework/${method}?csrfToken=${token}`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				},
				body: this.encoodeFormBody({
					"name": this.state.name,
					"due": moment(this.state.due).format("YYYY-MM-DD"),
					"desc": this.state.desc,
					"complete": (this.state.complete ? 1 : 0),
					"classId": this.state.classId,
					"id": this.state.id
				})
			}).then((response) => {
				return response.text();
			}).then((text) => {
				text = JSON.parse(text);
				if (text.status == "error") {
					this.setState({ error: text.error })
				} else {
					this.props.navigation.goBack()
				}
			}).catch((error) => {
				console.error(error)
			})
		}).catch((error) => {
			console.error(error);
		})
		//}
	}

	encoodeFormBody(body) {
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
		if (params) {
			this.state = params.homework;
			this.state.complete = (this.state.complete == 1 ? true : false)
			this.state.new = false;
		} else {
			this.state = { new: true };
		}
		this.state.loading = true;
		this.load();
	}

	load() {
		AsyncStorage.getItem('csrfToken').then((token) => {
			fetch('https://api-v2.myhomework.space/classes/get?csrfToken=' + token, {
				method: 'GET',
				credentials: 'include'
			}).then((response) => {
				return response.text();
			}).then((text) => {
				this.setState({
					loading: false,
					classes: JSON.parse(text).classes
				});
			}).catch((error) => {
				console.error(error)
			});
		}).catch((error) => {
			console.error(error);
		})
	}

	render() {
		if (!this.state.loading) {
			return (<KeyboardAvoidingView style={{ padding: 10, flex: 1, flexDirection: "column" }}>
				{this.state.error ? <Text style={styles.Error}>{this.state.error}</Text> : null}
				<TextInput
					placeholder="Assignment Name"
					value={this.state.name}
					onChangeText={(text) => this.setState({ name: text, changed: true })}
					style={styles.input}
				/>
				<Button onPress={() => this.setState({ showingDueDatePicker: true })}
					title={"Due " +
						(this.state.due
							? moment(this.state.due).format("ddd, MMM Do")
							: "date not set")}
				/>
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
				<Text>Done?</Text>
				<Switch
					onValueChange={(value) => this.setState({ complete: value })}
					value={this.state.complete} />
				<Picker
					selectedValue={this.state.classId}
					onValueChange={(itemValue, itemIndex) => this.setState({ classId: itemValue })}>
					{this.state.classes.map((classItem, i) => {
						return <Picker.Item label={classItem.name} value={classItem.id} key={"classitem_" + i} />
					})}
				</Picker>
				<TextInput
					placeholder="Description"
					value={this.state.desc}
					onChangeText={(text) => this.setState({ description: text })}
					style={styles.input}
					multiline={true}
				/>
			</KeyboardAvoidingView>);
		} else return <Loading />
	}
}

const styles = StyleSheet.create({
	input: {
		height: 50,
		fontSize: 20
	},
	Error: {
		color: "red",
	}
})

export default EditHomework;