import React from 'react';
import { View, ActivityIndicator , StyleSheet } from 'react-native';

class Loading extends React.Component {
    render() {
        return (
            <View style={[styles.LoadingVertical, styles.LoadingHorizontal]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
	LoadingVertical: {
		flex: 1,
		justifyContent: 'center'
	},
	LoadingHorizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	}	
});

export default Loading;