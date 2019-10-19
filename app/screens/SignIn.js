import React from 'react';
import {
    Alert,
    AsyncStorage,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import LoadingScreen from './common/LoadingScreen';
import { SafeAreaView } from 'react-navigation';

export default class SignIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            userHp: '',
            userPass: '',
        }
    }

    componentDidMount() {
		this.mounted = true;
	}
	
	componentWillUnmount() {
		this.mounted = false;
	}

    UserLogin = () => {
        let { userHp, userPass } = this.state;
        let navigation = this.props.navigation;

        if(userHp != '' && userPass != '') {
			this.setState({
				isLoading: true
            });

            fetch(`${global.api}fetch_data`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
                    appToken: global.appToken,
                    table: 'user_auth',
                    body: {
                        'userHp': userHp,
                        'userPass': userPass,
                        'userType': 'driver'
                    }
				})
			}).then((response) => response.json())
			.then((responseJson) => {
                console.log(responseJson);

                let d = new Date();
                let day = d.getDay();

                if(responseJson['data']['user']['status'] == '200') {
                    AsyncStorage.setItem('userPid', responseJson['data']['user']['user_pid']);
                    AsyncStorage.setItem('driverReport', responseJson['data']['report']);
                    AsyncStorage.setItem('projectPid', responseJson['data']['project_pid']);

                    if(responseJson['data']['user']['new'] == '1') {
                        navigation.navigate('DriverNew');
                    } else {
                        if(responseJson['data']['report'] == '1' || (day != 2 && day != 5)) {
                            navigation.navigate('SignedIn');
                        } else {
                            navigation.navigate('DriverReport');
                        }
                    }
                } else {
                    Alert.alert(responseJson['data']['user']['msg']);
                }

                if(this.mounted) {
                    this.setState({
                        isLoading: false
                    });
                }
            }).catch((error) => {
				console.error(error);
			});
        } else {
            Alert.alert('Mohon isi lengkap!');
        }
    }
    
    render() {
        if(this.state.isLoading) {
			return(<LoadingScreen />);
        }
        
        let navigation = this.props.navigation;

        return(
            <View
                style={{
                    flex: 1,
                }}
            >
                <ImageBackground source={require('../../assets/login_bg.jpg')} style={{width: '100%', height: '100%'}}>
                    <View
                        style={{
                            flex: 1,
                            paddingTop: 140
                        }}
                    >
                        {/* <Logo */}
                        <View
                            style={{
                                alignItems: 'center',
                                paddingBottom: 50
                            }}
                        >
                            <View
                                style={{
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 45,
                                        letterSpacing: 5,
                                        color: 'white'
                                    }}
                                >
                                    Noah
                                </Text>
                            </View>

                            <View>
                                <Text
                                    style={{
                                        fontStyle: 'italic'
                                    }}
                                >
                                    for Mitra
                                </Text>
                            </View>
                        </View>
                        {/* Logo> */}

                        <View
                            style={{
                                paddingHorizontal: 30
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                }}
                            >
                                <View style={ styles.containerInput }>
                                    <TextInput 
                                        placeholder='No. Handphone (08123456789)'
                                        onChangeText={ userHp => this.setState({ userHp }) }
                                        keyboardType='numeric'
                                        style={[
                                            styles.inputLogin,
                                            {
                                                borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15,
                                                borderBottomColor: '#e0e0e0',
                                                borderBottomWidth: 1
                                            }
                                        ]}
                                    />
                                </View>

                                <View style={ styles.containerInput }>
                                    <TextInput 
                                        placeholder='Password'
                                        onChangeText={ userPass => this.setState({ userPass })}
                                        autoCapitalize='none'
                                        secureTextEntry={true}
                                        style={[
                                            styles.inputLogin, 
                                            {
                                                borderBottomLeftRadius: 15,
                                                borderBottomRightRadius: 15
                                            }
                                        ]}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    marginTop: 35,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={ this.UserLogin }
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Masuk
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    alignItems: 'flex-end',
                                    paddingTop: 30
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'white'
                                        }}
                                    >
                                        Lupa Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Register */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        style={{
                            alignItems: 'center',
                            backgroundColor: 'white',
                        }}
                    >
                        <SafeAreaView
                            style={{
                                paddingVertical: 15,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#444444'
                                }}
                            >
                                Daftar sebagai Mitra
                            </Text>
                        </SafeAreaView>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerInput: {
        flexDirection: 'row',
    },
    inputLogin: {
        paddingHorizontal: 17,
        paddingVertical: 13,
        flex: 1,
        backgroundColor: 'white'
    }
});