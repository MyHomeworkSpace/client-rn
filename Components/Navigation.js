import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeworkView from './Views/HomeworkView.js'
import SettingsView from "./Views/SettingsView.js"
import ScheduleView from "./Views/ScheduleView.js"

export default createBottomTabNavigator(
	{
		Homework: {
			screen: HomeworkView,
		},
		Schedule: {
			screen: ScheduleView
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
			  iconName = `ios-home${focused ? '' : '-outline'}`;
			} else if (routeName === 'Schedules') {
			  iconName = `ios-calendar${focused ? '' : '-outline'}`;
			} else if (routeName === 'Settings') {
				iconName = `ios-options${focused ? '' : '-outline'}`;
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
