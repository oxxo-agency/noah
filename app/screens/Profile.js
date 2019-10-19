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

export default class Profile extends React.Component {

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
                    title='Profile'
                />

                <View>
                    <TouchableOpacity
                        onPress={() => {
                            AsyncStorage.removeItem('userPid');
                            navigation.navigate('SignedOut');
                        }}
                        style={{
                            alignItems: 'center'
                        }}
                    >
                        <View>
                            <View style={ styles.dataRow }>
                                <View style={ styles.dataLabel }>
                                    <Text style={ styles.txtLabel }>
                                        Nama
                                    </Text>
                                </View>

                                <View style={ styles.dataValue }>
                                    <Text style={ styles.txtValue }>
                                        { this.state.data[0].user_name }
                                    </Text>
                                </View>
                            </View>

                            <View style={ styles.dataRow }>
                                <View style={ styles.dataLabel }>
                                    <Text style={ styles.txtLabel }>
                                        Jenis Mobil
                                    </Text>
                                </View>

                                <View style={ styles.dataValue }>
                                    <Text style={ styles.txtValue }>

                                    </Text>
                                </View>
                            </View>

                            <View style={ styles.dataRow }>
                                <View style={ styles.dataLabel }>
                                    <Text style={ styles.txtLabel }>
                                        Plat Mobil
                                    </Text>
                                </View>

                                <View style={ styles.dataValue }>
                                    <Text style={ styles.txtValue }>

                                    </Text>
                                </View>
                            </View>
                        </View>
        
                        <View>
                            <Text>
                                Log Out
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});