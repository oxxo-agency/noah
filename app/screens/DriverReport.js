import React from 'react';
import {
    ActionSheetIOS,
    Alert,
    AsyncStorage,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import LoadingScreen from './common/LoadingScreen';
import { SafeAreaView } from 'react-navigation';

class DriverReportApp extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
            isLoading: true,
            odoSource: null,
            odoUri: '',
            odoName: '',
            odoType: '',
            stickerSource: null,
            stickerUri: '',
            stickerName: '',
            stickerType: '',
            image: '',
        }
    }

    async getToken() {
		try {
            let userPid = await AsyncStorage.getItem('userPid');

            this.setState({
                isLoading: false,
                userPid: userPid
            });
        } catch(error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.askPermissionsAsync();
        this.getToken();
    }
    
    componentWillUnmount() {
		this.mounted = false;
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    _PickCamera = async(img) => {
        await this.askPermissionsAsync();
		let result = await ImagePicker.launchCameraAsync({
			allowsEditing: false,
            base64: false,
		});
		console.log(result);
		
		if(!result.cancelled) {
			let imgUri = result.uri;
            let manipResult = await ImageManipulator.manipulateAsync(imgUri, [{ resize: { height: 1000 } }], { compress: 0.5});

            let localUri = manipResult.uri;
			let filename = localUri.split('/').pop();
			
			// Infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
			
            let source = { uri: manipResult.uri };

            if(this.mounted) {
                if(img == 'odo') {
                    this.setState({ 
                        odoSource: source,
                        odoUri: localUri,
                        odoName: filename,
                        odoType: type
                    });
                } else {
                    this.setState({ 
                        stickerSource: source,
                        stickerUri: localUri,
                        stickerName: filename,
                        stickerType: type
                    });
                }
            }
		}
    }

    _ShowActionSheet = (img) => {
		if(Platform.OS === 'ios') {
			ActionSheetIOS.showActionSheetWithOptions({
				options: ['Cancel', 'Take Photo'],
				cancelButtonIndex: 0,
			},
			(buttonIndex) => {
				if(buttonIndex === 1) {
					this._PickCamera(img);
				}
			});
		} else if(Platform.OS === 'android') {
			let options = ['Take Photo', 'Cancel'];
			let cancelButtonIndex = 1;

			this.props.showActionSheetWithOptions({
				options,
				cancelButtonIndex,
			},
			(buttonIndex) => {
				if(buttonIndex === 0) {
					this._PickCamera(img);
				}
			});
		}
    }

    _UploadImage = () => {
        let { odoName, odoSource, odoType, odoUri, stickerName, stickerSource, stickerType, stickerUri, userPid } = this.state;
        let navigation = this.props.navigation;

        if(odoName != '' && stickerName != '') {
            let formData = new FormData();

            this.setState({
                isLoading: true
            });

            formData.append('odo', {
                uri: odoUri,
                name: odoName,
                type: odoType
            });
            
            formData.append('sticker', {
                uri: stickerUri,
                name: stickerName,
                type: stickerType
            });

            formData.append('userPid', userPid);

            fetch(`${global.api}data_controller/upload_driver_report`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);

                if(responseJson['status'] == '200') {
                    AsyncStorage.setItem('driverReport', '1');
                    navigation.navigate('SignedIn');
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            Alert.alert('Mohon upload foto Odometer dan Sticker');
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
                    paddingTop: 40,
                }}
            >
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <View style={ styles.containerUpload }>
                        <View style={ styles.containerLabel }>
                            <Text>
                                Mohon Foto Odometer Anda
                            </Text>
                        </View>

                        <View style={ styles.containerBtnUpload }>
                            <TouchableOpacity
                                onPress={() => this._PickCamera('odo')}
                                style={ styles.btnUpload }
                            >
                                { this.state.odoSource != null ?
                                    <Image
                                        source={ this.state.odoSource }
                                        style={ styles.imgPreview }
                                        resizeMode='contain'
                                    />
                                : 
                                    <Text>Upload Image</Text> 
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={ styles.containerUpload }>
                        <View style={ styles.containerLabel }>
                            <Text>
                                Mohon Foto Stiker di mobil Anda
                            </Text>
                        </View>

                        <View style={ styles.containerBtnUpload }>
                            <TouchableOpacity
                                onPress={() => this._PickCamera('sticker')}
                                style={ styles.btnUpload }
                            >
                                { this.state.stickerSource != null ?
                                    <Image
                                        source={ this.state.stickerSource }
                                        style={ styles.imgPreview }
                                        resizeMode='contain'
                                    />
                                : 
                                    <Text>Upload Image</Text> 
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            backgroundColor: 'green'
                        }}
                        onPress={ this._UploadImage }
                    >
                        <SafeAreaView
                            style={{
                                paddingVertical: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    letterSpacing: 2,
                                    fontSize: 15
                                }}
                            >
                                Simpan
                            </Text>
                        </SafeAreaView>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerUpload: {
        flex: 1
    },
    containerLabel: {
        alignItems: 'center',
        paddingTop: 20,
    },
    containerBtnUpload: {
        flex: 1,
    },
    btnUpload: {
        borderWidth: 1,
        marginHorizontal: 20,
        marginVertical: 25,
        borderColor: '#cacaca',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    imgPreview: {
        width: '100%',
        height: '100%'
    }
});

const DriverReportContainer = connectActionSheet(DriverReportApp)

export default class DriverReport extends React.Component {
    render() {
        let navigation = this.props.navigation;

        return(
            <ActionSheetProvider>
                <DriverReportContainer navigation={ navigation } />
            </ActionSheetProvider>
        )
    }
}