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
import AppPicker from './common/AppPicker';

const styleGeneral = require('./styles/StyleGeneral');

export default class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            optBrand: [],
            optType: [],
            optColor: [],
            optCity: [],
            optVehicle: [
                {
                    value: '',
                    label: 'Silahkan Pilih Jenis Kendaraan'
                }, {
                    value: '0',
                    label: 'Mobil'
                }, {
                    value: '1',
                    label: 'Motor'
                }
            ],
            userName: '',
            userHp: '',
            vBrand: '',
            vType: '',
            vColor: '',
            vJenis: '',
            vPlat: '',
            vCity: ''
        }
    }

    async getToken() {
        try {
            let navigation = this.props.navigation;

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
                    table: 'fetch_driver_register_options',
                    body: ''
				})
			}).then((response) => response.json())
			.then((responseJson) => {
                console.log(responseJson);
                
                if(responseJson['status'] == '200') {
                    if(this.mounted) {
                        this.setState({
                            isLoading: false,
                            optBrand: responseJson['data']['brand'],
                            optColor: responseJson['data']['color'],
                            optCity: responseJson['data']['city']
                        });
                    }
				} else {
                    if(this.mounted) {
                        this.setState({ isLoading: false });
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
                        'userName': userName,
                        'vBrand': vBrand,
                        'vType': vType,
                        'vColor': vColor,
                        'vPlat': vPlat,
                        'vCity': vCity
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

    FetchCarType = (vBrand, vJenis) => {
        if(vBrand != '') {
            fetch(`${global.api}fetch_data`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appToken: global.appToken,
                    table: 'fetch_vehicle_type',
                    body: {
                        'vBrand': vBrand,
                        'vJenis': vJenis
                    }
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                
                if(responseJson['status'] == '200') {
                    if(this.mounted) {
                        this.setState({
                            optType: responseJson['data']['type']
                        });
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
        }
    }
    
    render() {
        if(this.state.isLoading) {
            return(<LoadingScreen />);
        }

        let navigation = this.props.navigation;
        let that = this;

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

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        elevation: 3,
                        shadowColor: 'grey',
                        shadowOffset: { width: 1.5, height: 1.5 },
                        shadowRadius: 2,
                        shadowOpacity: 0.35
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingVertical: 15,
                            paddingHorizontal: 17,
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text>
                            {"<"}
                        </Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: '#444444'
                            }}
                        >
                            Daftar sebagai Mitra
                        </Text>
                    </View>
                </View>

                <ScrollView
                    style={{
                        paddingHorizontal: 15,
                        flex: 1
                    }}
                >
                    <View
                        style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}
                    >
                        <Text>
                            
                        </Text>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
                                Nama Lengkap
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <TextInput 
                                style={ styles.input }
                                placeholder=''
                                onChangeText={ userName => this.setState({ userName })}
                                value={ this.state.userName }
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
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
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
                                Jenis Kendaraan
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <AppPicker 
                                items={ this.state.optVehicle }
                                value={ this.state.vJenis }
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ vJenis: itemValue });
                                    that.FetchCarType(this.state.vBrand, itemValue);
                                }}
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
                                Merk Kendaraan
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <AppPicker 
                                items={ this.state.optBrand }
                                value={ this.state.vBrand }
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ vBrand: itemValue });
                                    that.FetchCarType(itemValue, this.state.vJenis);
                                }}
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
                                Tipe Kendaraan
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <AppPicker 
                                items={ this.state.optType }
                                value={ this.state.vType }
                                onValueChange={(itemValue, itemIndex) =>
                                this.setState({ vType: itemValue })}
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
                                Warna Kendaraan
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <AppPicker 
                                items={ this.state.optColor }
                                value={ this.state.vColor }
                                onValueChange={(itemValue, itemIndex) =>
                                this.setState({ vColor: itemValue })}
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
                                Nomor Plat Kendaraan
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <TextInput 
                                style={ styles.input }
                                placeholder=''
                                onChangeText={ vPlat => this.setState({ vPlat })}
                                value={ this.state.vPlat }
                            />
                        </View>
                    </View>

                    <View style={ styles.formRow }>
                        <View style={ styles.formLabel }>
                            <Text style={ styles.labelTxt }>
                                Area Perjalanan Sehari-hari
                            </Text>
                        </View>

                        <View style={ styles.formInput }>
                            <AppPicker 
                                items={ this.state.optCity }
                                value={ this.state.vCity }
                                onValueChange={(itemValue, itemIndex) =>
                                this.setState({ vCity: itemValue })}
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
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    formRow: {
        paddingVertical: 10,
    },
    formLabel: {
        paddingHorizontal: 10
    },
    formInput: {
        paddingVertical: 3,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#cacaca',
        paddingVertical: 5,
        paddingHorizontal: 15,
    }
});