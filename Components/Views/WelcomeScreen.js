import React from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Platform, } from 'react-native';
import LottieView from 'lottie-react-native';

class Loading extends React.Component {
    static navigationOptions = {
        title: "MyHomeworkSpace",
    };

    render() {
        return (
            <ImageBackground source={require('../../assets/img/bg1.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <LottieView
                        source={require('../../assets/animation/introAnimation.json')}
                        loop={false}
                        style={{ paddingBottom: 40 }}
                        autoPlay
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("SignIn")}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: "rgba(255,255,255,0.5)",
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 40,
    }
});

export default Loading;