import React from 'react';
import { SectionList, Text, StyleSheet, View, AsyncStorage, Button, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

import EditHomework from './EditHomework.js'
import HomeworkListItem from "../HomeworkListItem.js"
import Loading from '../Loading.js'


const IoniconsHeaderButton = passMeFurther => (
	<HeaderButton {...passMeFurther} IconComponent={Icon} iconSize={23} />
  );
  
class HomeworkViewScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "MyHomeworkSpace",
			headerRight: (
				<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
					<Item title="Add" onPress={() => navigation.navigate('EditHomework')} />
				</HeaderButtons>
			),
		};
	};

	load() {
		this.setState({
			refreshing: true
		})
		AsyncStorage.getItem('csrfToken').then((token) => {
			fetch('https://api-v2.myhomework.space/homework/getHWViewSorted?showToday=true&csrfToken=' + token, {
				method: 'GET',
				credentials: 'include'
			}).then((response) => {
				return response.text();
			}).then((text) => {
				this.setState({
					loading: false,
					refreshing: false,
					homework: JSON.parse(text)
				});
			}).catch((error) => {
				console.error(error)
			});
			fetch('https://api-v2.myhomework.space/prefixes/getDefaultList?&csrfToken=' + token, {
				method: 'GET',
				credentials: 'include'
			}).then((response) => {
				return response.text();
			}).then((text) => {
				const list = JSON.parse(text).prefixes;
				const reference = {};
				for (const i in list) {
					const bg = list[i].background;
					const color = list[i].color;
					for(const j in list[i].words){
						reference[list[i].words[j]] = {
							background: bg,
							color: color
						}
					}
				}
				this.setState({
					prefixes: reference
				});
			}).catch((error) => {
				console.error(error)
			});
		}).catch((error) => {
			console.error(error);
		})
	}

	constructor(props) {
		super(props);
		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		this.load();
	}

	render() {
		if (!this.state.loading && this.state.prefixes) {
			let overdue = [];
			let today = [];
			let tomorrow = [];
			let soon = [];
			let longterm = [];
			let sections = [];
			for (const item in this.state.homework.overdue) {
				const homeworkItem = this.state.homework.overdue[item];
				overdue.push(homeworkItem);
			}
			for (const item in this.state.homework.today) {
				const homeworkItem = this.state.homework.today[item];
				today.push(homeworkItem);
			}
			for (const item in this.state.homework.tomorrow) {
				const homeworkItem = this.state.homework.tomorrow[item];
				tomorrow.push(homeworkItem);
			}
			for (const item in this.state.homework.soon) {
				const homeworkItem = this.state.homework.soon[item];
				soon.push(homeworkItem);
			}
			for (const item in this.state.homework.longterm) {
				const homeworkItem = this.state.homework.longterm[item];
				soon.push(homeworkItem);
			}
			if (overdue.length > 0) sections.push({ title: "Overdue", data: overdue })
			if (today.length > 0) sections.push({ title: "Due Today", data: today })
			if (tomorrow.length > 0) sections.push({ title: "Due Tomorrow", data: tomorrow })
			if (soon.length > 0) sections.push({ title: "Due Soon", data: soon })
			if (longterm.length > 0) sections.push({ title: "Long Term", data: longterm })
			return (
				<View style={styles.container}>
					<SectionList
						sections={sections}
						renderItem={
							({ item }) => <HomeworkListItem prefixes={this.state.prefixes} homeworkItem={item} onPress={function () {
								this.props.navigation.navigate('EditHomework', { homework: item })
							}.bind(this)} />}
						renderSectionHeader={({ section }) => (<Text style={styles.sectionHeader}>{section.title}</Text>)}
						keyExtractor={(item, index) => index}
						onRefresh={() => {
							this.load();
						}}
						refreshing={this.state.refreshing}
						stickySectionHeadersEnabled={true}
					/>
				</View>
			);
		} else { return <Loading /> }
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sectionHeader: {
		paddingTop: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 2,
		fontSize: 14,
		fontWeight: 'bold',
		backgroundColor: 'rgba(247,247,247,1.0)',
	},
})

export default createStackNavigator(
	{
		HomeworkView: HomeworkViewScreen,
		EditHomework: EditHomework
	},
	{
		initialRouteName: 'HomeworkView',
	}
);
