import React from 'react';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import LoadingScreen from './common/LoadingScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class DriverNew extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            userPid: '',
            password: '',
            rePassword: ''
        }
    }

    async getToken() {
        try {
            let userPid = await AsyncStorage.getItem('userPid');

            if(this.mounted) {
                this.setState({
                    isLoading: false,
                    userPid: userPid
                })
            }
        } catch(error) {
            console.log(error);
        }
    }

    _SubmitPassword = () => {
        let navigation = this.props.navigation;
        let { userPid, password, rePassword } = this.state;

        if(password == rePassword) {
            fetch(`${global.api}fetch_data`, 
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appToken: global.appToken,
                    table: 'update_driver_password',
                    body: {
                        userPid: userPid,
                        password: password
                    }
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);

                if(responseJson['status'] == '200') {
                    navigation.navigate('DriverReport');
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            Alert.alert('Password dan Ulangi Password harus sama');
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
                <View style={ styles.formRow }>
                    <View style={ styles.formLabel }>
                        Silahkan isi password baru
                    </View>

                    <View style={ styles.formInput }>
                        <TextInput 
                            style={ styles.inputPassword }
                            onChangeText={ password => this.setState({ password })}
                        />
                    </View>
                </View>

                <View style={ styles.formRow }>
                    <View style={ styles.formLabel }>
                        Mohon ulangi password
                    </View>

                    <View style={ styles.formInput }>
                        <TextInput 
                            style={ styles.inputPassword }
                            onChangeText={ rePassword => this.setState({ rePassword })}
                        />
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={ this._SubmitPassword }
                    >
                        <Text>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formLabel: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    inputPassword: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
});