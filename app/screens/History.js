import React from 'react';
import {
    AsyncStorage,
    SafeAreaView,
    Text,
    View
} from 'react-native';

import LoadingScreen from './common/LoadingScreen';

const styleGeneral = require('./styles/StyleGeneral');

export default class History extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            userPid: '',
            session: []
        }
    }

    async getToken() {
        let userPid = await AsyncStorage.getItem('userPid');

        try {
            fetch(`${global.api}fetch_data`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appToken: global.appToken,
                    table: 'fetch_driver_history',
                    body: {
                        'pid': userPid
                    }
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
            }).catch((error) => {
                console.error(error);
            });
        } catch(error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _ListSessions() {

    }
    
    render() {
        if(this.state.isLoading) {
            return(<LoadingScreen />);
        }

        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'red'
                }}
            >
                
                <View>
                    <Text>
                        Sign In
                    </Text>
                </View>
            </View>
        );
    }

}