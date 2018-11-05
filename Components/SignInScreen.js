import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, AsyncStorage } from 'react-native';

import Loading from './Loading'

class SignInScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			pageLoading: true,
		}
		this.load();
	}

	load() {
		fetch('https://api-v2.myhomework.space/auth/csrf', {
			method: 'GET',
			credentials: 'include',
		}).then((response) => {
			return response.text();
		}).then((text) => {
			this.setState({
				csrfToken: JSON.parse(text).token,
				pageLoading: false,
			});
			return JSON.parse(text).token;
		}).then((token) => {
			return AsyncStorage.setItem('csrfToken', token);
		}).catch((error) => {
			alert("Could not connect to MyHomeworkSpace server.")
		});
	}

	encoodeFormBody(username, password) {
		var details = {
			'username': username,
			'password': password,
		};

		var formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		return formBody.join("&");
	}

	handlePress() {
		this.setState({ loading: true })
		fetch('https://api-v2.myhomework.space/auth/login?csrfToken=' + this.state.token, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: this.encoodeFormBody(this.state.username, this.state.password)
		}).then((response) => {
			return response.text();
		}).then((text) => {
			const data = JSON.parse(text);
			if (data.status == "error") {
				this.setState({
					loading: false,
					signInError: data.error
				})
			} else {
				this.props.navigation.navigate('App');
			}
		}).catch((error) => {
			console.error(`Error during sign-in request\n${error}`);
		})
	}

	render() {
		if(this.state.pageLoading) return <Loading />
		return (
			<View style={styles.PageSpacing} >
				<Text style={styles.SignInText}>Sign In</Text>
				<Text style={styles.SignInHint}>Use your DaltonID to sign in.</Text>
				<Text style={[styles.SignInHint, styles.SignInError]}>{this.state.signInError}</Text>
				<TextInput
					style={styles.Input}
					placeholder="cXXab"
					onChangeText={(text) => this.setState({ username: text })}
				/>
				<TextInput
					style={styles.Input}
					placeholder="password"
					secureTextEntry={true}
					onChangeText={(text) => this.setState({ password: text })}
				/>
				<Button
					disabled={this.state.loading}
					onPress={this.handlePress.bind(this)}
					title={this.state.loading ? "Signing In..." : "Sign In..."}
					accessibilityLabel="Sign in"
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	SignInText: {
		fontSize: 40,
	},
	SignInHint: {
		fontSize: 20,
		color: "#999999",
	},
	SignInError: {
		color: "red"
	},
	Input: {
		height: 50,
		fontSize: 20
	},
	PageSpacing: {
		paddingTop: 100,
		padding: 20
	},
});

export default SignInScreen;