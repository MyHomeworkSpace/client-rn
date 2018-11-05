import React from 'react';
import { AsyncStorage, Text } from 'react-native'
import { createStackNavigator } from 'react-navigation';

import Loading from '../Loading.js'

class SettingsView extends React.Component {
    static navigationOptions = {
		title: "Settings",
	};

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
        this.load();
    }

    load() {
        AsyncStorage.getItem('csrfToken').then((token) => {
			fetch('https://api-v2.myhomework.space/auth/me?csrfToken=' + token, {
				method: 'GET',
				credentials: 'include'
			}).then((response) => {
				return response.text();
			}).then((text) => {
                console.log(text);
				this.setState({
                    me: JSON.parse(text),
                    loading: false,
                });
                console.log(this.state.me)
			}).catch((error) => {
				console.error(error)
			});
		}).catch((error) => {
			console.error(error);
		})
    }

    render() {
        if(!this.state.loading) {
            return (<Text>
                {JSON.stringify(this.state.me)}
            </Text>)
        } else return <Loading />
    }
}

export default createStackNavigator(
	{
		SettingsView: SettingsView,
	},
	{
		initialRouteName: 'SettingsView',
	}
);