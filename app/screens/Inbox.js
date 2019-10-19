import React from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import LoadingScreen from './common/LoadingScreen';
import Header from './common/Header';

export default class Inbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: []
        }
    }

    async getToken() {
        try {
            let pid = await AsyncStorage.getItem('userPid');
            const navigation = this.props.navigation;

			// Fetch home data
			fetch(`${global.api}fetch_data`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appToken: global.appToken,
                    table: 'fetch_driver_info',
                    body: {
                        'pid': pid
                    }
				})
			}).then((response) => response.json())
			.then((responseJson) => {
                console.log(responseJson);
                
                if(responseJson['status'] == '200') {
					if(this.mounted) {
						this.setState({
							isLoading: false,
                            data: responseJson['data']['driver']
						});
					}
				}
			}).catch((error) => {
				console.error(error);
			});
			
		} catch(error) {
			console.log(error);
		}
    }

    componentDidMount() {
        this.mounted = true;
        this.getToken();
    }
    
    componentWillUnmount() {
		this.mounted = false;
    }

    render() {
        let navigation = this.props.navigation;

        if(this.state.isLoading) {
            return(<LoadingScreen />);
        }

        return(
            <View
                style={{
                    flex: 1,
                }}
            >
                <Header
                    navigation={ navigation }
                    title='Inbox'
                />
            </View>
        );
    }
}