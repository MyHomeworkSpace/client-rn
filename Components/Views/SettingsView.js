import React from 'react';
import { AsyncStorage, Text, ScrollView, StyleSheet, Button, View } from 'react-native'
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
        AsyncStorage.getItem('token').then((token) => {
            fetch('https://api-v2.myhomework.space/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            }).then((response) => {
                return response.text();
            }).then((text) => {
                this.setState({
                    me: JSON.parse(text),
                    loading: false,
                });
            }).catch((error) => {
                console.error(error)
            });
        }).catch((error) => {
            alert("Could not connect to MyHomeworkSpace server.");
        })
    }

    render() {
        if (!this.state.loading) {
            if (this.state.me.error == "logged_out") {
                AsyncStorage.getAllKeys((keys) => console.log(keys))
                AsyncStorage.getItem("token", (token) => console.log(token))
                return (<View>
                    <Button title="Fix App" onPress={async () => { await AsyncStorage.clear(); this.props.navigation.navigate('LoadApp'); }} />
                </View>)
            }
            return (<ScrollView>
                <Text style={styles.hello}>Hi, {this.state.me.user.name.split(' ')[0]}</Text>
                <Text style={styles.subtitle}>Grade {this.state.me.grade} | {this.state.me.user.email} {this.state.me.level > 0 ? (<Text>| <Text style={styles.admin}>Admin</Text></Text>) : null}</Text>
                <Button title="Sign Out" color="red" onPress={async () => {
                    await AsyncStorage.removeItem("token");
                    this.props.navigation.navigate('LoadApp');
                }} />
            </ScrollView>)
        } else return <Loading />
    }
}

const styles = StyleSheet.create({
    hello: {
        paddingTop: 10,
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center"
    },
    subtitle: {
        textAlign: "center",
        color: "#777777",
        paddingTop: 5,
        paddingBottom: 10
    },
    admin: {
        color: "blue"
    }
})

export default createStackNavigator(
    {
        SettingsView: SettingsView,
    },
    {
        initialRouteName: 'SettingsView',
    }
);