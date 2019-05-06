import React from 'react';
import { AsyncStorage, Text, ScrollView, StyleSheet, Button, View, Alert } from 'react-native'
import { createStackNavigator } from 'react-navigation';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

import Loading from '../Loading.js'
import api from '../../api'

class SettingsView extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Settings",
            headerRight: (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title="Sign Out" onPress={async () => {
                        Alert.alert(
                            "Sign Out",
                            "Are you sure you want to sign out?",
                            [{
                                text: "Cancel",
                                style: "danger",
                            },
                            {
                                text: "Sign Out",
                                onPress: async () => {
                                    await AsyncStorage.removeItem("token");
                                    navigation.navigate('LoadApp');
                                }
                            }]
                        )
                    }} />
                </HeaderButtons>
            ),
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
        this.load();
    }

    async load() {
        let me = await api.GET("auth/me")
        this.setState({
            me: me,
            loading: false,
        });
    }

    render() {
        if (!this.state.loading) {
            if (this.state.me.error == "logged_out") {
                return (<View>
                    <Button title="Fix App" onPress={async () => { await AsyncStorage.clear(); this.props.navigation.navigate('LoadApp'); }} />
                </View>)
            }
            return (<ScrollView>
                <Text style={styles.hello}>Hi, {this.state.me.user.name.split(' ')[0]}</Text>
                <Text style={styles.subtitle}>Grade {this.state.me.grade} | {this.state.me.user.email} {this.state.me.level > 0 ? (<Text>| <Text style={styles.admin}>Admin</Text></Text>) : null}</Text>
                {/* <Button title="Sign Out" color="red" onPress={} /> */}
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