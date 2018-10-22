import React from 'react';
import {AsyncStorage} from 'react-native';

import Loading from "./Components/Loading.js"
import SignInScreen from './Components/SignInScreen.js'
import Navigation from './Components/Navigation.js'

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = ({
			isLoggedIn: false,
			loaded: false
		});
		fetch('https://api-v2.myhomework.space/auth/csrf', {
			method: 'GET',
			credentials: 'include',
		}).then((response) => {
			return response.text();
		}).then((text) => {
			this.setState({
				csrfToken: JSON.parse(text).token,
				loaded: true,
			});
			return JSON.parse(text).token;
		}).then((token) => {
			return AsyncStorage.setItem('csrfToken', token);
		}).catch((error) => {
			console.error(error)
		});
	}

	handleLogin() {
		fetch('http')
		this.setState({
			isLoggedIn: true
		})
	}

	render() {
		if (this.state.loaded && this.state.isLoggedIn) {
			return <Navigation csrfToken={this.state.csrfToken} />
		} else if(this.state.loaded && !this.state.isLoggedIn) {
			return <SignInScreen onLogin={this.handleLogin.bind(this)} csrfToken={this.state.csrfToken} />
		}
		return (
			<Loading />
		);
	}
}