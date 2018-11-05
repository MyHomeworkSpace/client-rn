import React from 'react';
import { AsyncStorage } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeworkView from './Components/Views/HomeworkView.js'
import SettingsView from "./Components/Views/SettingsView.js"
import CalendarView from "./Components/Views/CalendarView.js"
import Loading from "./Components/Loading.js"
import SignInScreen from './Components/SignInScreen.js'

class LoadApp extends React.Component {
	constructor(props) {
		super(props);
		this.load();
	}

	load = async () => {
		const token = await AsyncStorage.getItem("csrfToken");
		console.log(token);
		this.props.navigation.navigate(token ? "App" : "Auth");
	}

	render() { return <Loading /> }
}

const AppTab = createBottomTabNavigator(
	{
		Homework: {
			screen: HomeworkView,
		},
		Calendar: {
			screen: CalendarView,
		},
		Settings: {
			screen: SettingsView
		}
	},
	{
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, tintColor }) => {
				const { routeName } = navigation.state;
				let iconName;
				if (routeName === 'Homework') {
					iconName = `md-home`;
				} else if (routeName === 'Calendar') {
					iconName = `md-calendar`;
				} else if (routeName === 'Settings') {
					iconName = `md-options`;
				}

				// You can return any component that you like here! We usually use an
				// icon component from react-native-vector-icons
				return <Ionicons name={iconName} size={25} color={tintColor} />;
			},
		}),
		tabBarPosition: 'bottom',
		animationEnabled: true,
		swipeEnabled: false,
	}
);

const AuthStack = createStackNavigator({ SignIn: SignInScreen })

export default createSwitchNavigator(
	{
		LoadApp: LoadApp,
		App: AppTab,
		Auth: AuthStack,
	},
	{
		initialRouteName: 'LoadApp',
	}
);