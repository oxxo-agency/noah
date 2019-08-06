import React from 'react';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import LoadingScreen from './common/LoadingScreen';

export default class SignIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            userHp: '',
            userPass: '',
        }
    }

    UserLogin = () => {
        let { userHp, userPass } = this.state;

        if(userHp != '' && userPass != '') {
			this.setState({
				isLoading: true
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
                    backgroundColor: 'red'
                }}
            >
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
                                for mitra
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
                                marginTop: 20,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'blue',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                }}
                            >
                                <Text>
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
                                    backgroundColor: 'blue',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                }}
                            >
                                <Text>
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
                        paddingVertical: 15,
                    }}
                >
                    <Text>
                        Daftar sebagai Mitra
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerInput: {
        flexDirection: 'row',
    },
    inputLogin: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flex: 1,
        backgroundColor: 'white'
    }
});