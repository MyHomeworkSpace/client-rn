import React from 'react';
import { Platform, WebView, AsyncStorage } from 'react-native';

import Loading from './Loading'

const clientID = (Platform.OS == "ios" ?
	"_Q4MnXrt2H5kGGhAOO65Py4-z2tCi195mJIzIrjjewRadPzFGKQVThe2" :
	"SCD7XeQ_9Y0B6Sks8re71nk-qCxUJwxhZNS6hSFDTsBmG0uZMdZoS74Z")

class SignInScreen extends React.Component {
	static navigationOptions = {
		title: "Sign In",
	};

	getToken(url) {
		var params = {};
		var search = decodeURIComponent(url.slice( url.indexOf( '?' ) + 1 ) );
		var definitions = search.split( '&' );
	
		definitions.forEach( function( val, key ) {
			var parts = val.split( '=', 2 );
			params[ parts[ 0 ] ] = parts[ 1 ];
		} );
	
		return params.token
	}
	

	render() {
		return (
			<WebView
				originWhitelist={['*//*.myhomework.space/*']}
				source={{ uri: 'https://api-v2.myhomework.space/application/requestAuth/' + clientID }}
				renderLoading={() => { return <Loading /> }}
				onNavigationStateChange={(webViewState) => {
					if (webViewState.url.indexOf("stuff.myhomework.space/") >= 0) {
						const token = this.getToken(webViewState.url) + "="; //hack
						AsyncStorage.setItem("token", token, () => this.props.navigation.navigate('App'));
					}
				}}
			/>
		)
	}
}

export default SignInScreen;