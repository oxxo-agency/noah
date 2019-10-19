import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import LoadingScreen from './common/LoadingScreen';

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            userHp: '',
            userPass: ''
        }
    }

    _SignUp = () => {
        this.setState({ isLoading: true });

        let { userHp, userName, vBrand, vType, vColor, vPlat, vCity } = this.state;
        let navigation = this.props.navigation;

        if(userHp != '' && userName != '' && vBrand != '' && vType != '' && vColor != '' && vPlat != '' && vCity != '') {
            fetch(`${global.api}fetch_data`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appToken: global.appToken,
                    table: 'insert_driver_new',
                    body: {
                        'userHp': userHp,
                        'userPass': userPass
                    }
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                
                if(responseJson['status'] == '200') {
                    if(responseJson['data']['status'] == '200') {
                        Alert.alert('Berhasil', 'Terima kasih telah mendaftar, anda akan kami hubungi apabila ada pengiklan yang mau beriklan di kendaraan anda.');
                        navigation.navigate('SignIn');
                    } else {
                        Alert.alert('Gagal', responseJson['data']['msg']);
                        this.setState({ isLoading: false });
                    }
                } else {
                    if(this.mounted) {
                        this.setState({
                            isLoading: false,
                        });
                    }
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            Alert.alert('Mohon isi lengkap');
            if(this.mounted) {
                this.setState({ isLoading: false });
            }
        }
    }

    render() {
        if(this.state.isLoading) {
            return(<LoadingScreen />);
        }

        return(
            <View
                style={{
                    flex: 1,
                }}
            >
                <StatusBar barStyle="light-content" />
                <SafeAreaView
                    style={ styleGeneral.safeAreaView }
                ></SafeAreaView>

                <View>
                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text>
                                No. Handphone
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <TextInput 
                                style={ styles.input }
                                placeholder=''
                                onChangeText={ userHp => this.setState({ userHp })}
                                keyboardType='numeric'
                                value={ this.state.userHp }
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text>
                                Password
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <TextInput 
                                style={ styles.input }
                                placeholder=''
                                onChangeText={ userPass => this.setState({ userPass })}
                                value={ this.state.userPass }
                            />
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                backgroundColor: 'blue',
                                alignItems: 'center',
                                marginBottom: 150,
                                marginTop: 25,
                            }}
                            onPress={ this._SignUp }
                        >
                            <Text
                                style={{
                                    color: 'white'
                                }}
                            >
                                Daftar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formLabel: {
        
    }
})