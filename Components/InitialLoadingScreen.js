import React from 'react';
import Loading from './Components/Loading.js';

class IntialLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.loadLogin();
    }

    loadLogin = async () => {
        const token = await AsyncStorage.getItem('token');
        this.props.navigation.navigate(token ? 'App' : 'Auth');
    }

    render() {
        return <Loading />;
    }
}

export default IntialLoadingScreen;