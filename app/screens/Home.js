import React from 'react';
import {
    Alert,
    AsyncStorage,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import { Stopwatch } from 'react-native-stopwatch-timer';
import * as FileSystem from 'expo-file-system';

import LoadingScreen from './common/LoadingScreen';

const styleGeneral = require('./styles/StyleGeneral');
const LOCATION_TASK_NAME = 'background-location-task';

let SESSION_PID = '99';
let arrLog = [];

export default class Home extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
            isLoading: true,
            userPid: '',
            location: {
                coords: {
                    latitude: 0,
                    longitude: 0,
                }
            },      
            stopwatchStart: false,
            stopwatchReset: false,
        };
        
        this.toggleStopwatch = this.toggleStopwatch.bind(this);
        this.resetStopwatch = this.resetStopwatch.bind(this);
    }

    async getToken() {
		try {
            let navigation = this.props.navigation;
            let userPid = await AsyncStorage.getItem('userPid');

            let { status } = await Permissions.askAsync(Permissions.LOCATION);

            if(status !== 'granted') {
                // Not granted location permission
            }

            let location = await Location.getCurrentPositionAsync({});

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
                        'pid': userPid
                    }
				})
			}).then((response) => response.json())
			.then((responseJson) => {
                console.log(responseJson);
                
                if(responseJson['status'] == '200') {
                    if(location) {
                        if(this.mounted) {
                            this.setState({ 
                                isLoading: false,
                                location: location,
                                userPid: userPid
                            });

                            console.log(location);
                        }
                    } else {
                        console.log('no');
                    }
				}
			}).catch((error) => {
				console.error(error);
			});
		} catch(error) {
			console.log(error);
		}
    }

    componentWillMount() {
        this.getToken();
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    
    toggleStopwatch() {
        this.setState({ stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false });
    }
    
    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true});
    }
    
    getFormattedTime(time) {
        this.currentTime = time;
    };

    WriteLog = async() => {
        let log = JSON.stringify({
            la: '123.1235834',
            lo: '-0.12352351',
            al: '',
        });

        try {
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'log.txt', log);
            console.log('write');
        } catch(error) {
            console.log(error);
        }
    }

    ReadDir = async() => {
        let props = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'log.txt');
        console.log(props);
        let read = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'log.txt');
        console.log(read);

        if (props.exists && props.isDirectory) {
            return props;
        }
    }

    ReadLog = async() => {
        let dir = await this.ReadDir();
        let filename = await FileSystem.readDirectoryAsync(dir.uri);
        console.log(filename);
    }

    TrackLocation = async() => {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 10,
            deferredUpdatesInterval : 10,
            distanceInterval: 1,
        });
    };

    StopLocation = async() => {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log(arrLog);

        try {
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'log.txt', JSON.stringify(arrLog));
            console.log('write');
        } catch(error) {
            console.log(error);
        }
    }

    SendLocation = () => {
        this.setState({
            isLoading: true
        });

        let { userPid } = this.state;

        let formData = new FormData();

        formData.append('log', {
            uri: FileSystem.documentDirectory + 'log.txt',
            name: 'log.txt',
            type: 'text/plain'
        });

        formData.append('userPid', userPid);

        fetch(`${global.api}log_controller/save_log`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);

            if(this.mounted) {
                this.setState({
                    isLoading: false
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    
    Start = () => {
        let that = this;

        Alert.alert(
            'Start?',
            '',
            [
                {
                    text: 'Batal'
                },
                {
                    text: 'Ya',
                    onPress: () => {
                        SESSION_PID = '5';
                        that.TrackLocation();
                        that.toggleStopwatch();
                    }
                }
            ]
        )
    }

    End = () => {
        let that = this;

        Alert.alert(
            'Selesai?',
            '',
            [
                {
                    text: 'Batal'
                },
                {
                    text: 'Ya',
                    onPress: () => {
                        that.StopLocation();
                        that.toggleStopwatch();
                    }
                }
            ]
        )
    }

    _getLocationAsync = async() => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if(status !== 'granted') {
            // Not granted location permission
        }

        let location = await Location.getCurrentPositionAsync({});

        if(location) {
            this.setState({ 
                isLoading: false,
                location: location 
            });

            console.log(location);
        } else {
            console.log('no');
        }
    }

    _insertLocation = async() => {
        try {

        } catch (error) {
            console.log(error);
        }
    }
    
    render() {
        if(this.state.isLoading) {
            return(<LoadingScreen />);
        }

        let navigation = this.props.navigation;
        let { userPid } = this.state;
        
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
            >
                <StatusBar barStyle="light-content" />

                <View
                    style={{
                        position: 'absolute',
                        flex: 1,
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <MapView
                        style={{
                            flex: 1
                        }}
                        initialRegion={{
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            latitudeDelta: 0.00922,
                            longitudeDelta: 0.00421
                        }}
                    />
                    
                    {/*<Text>{ this.state.location.coords.latitude }</Text>
                    <Text>{ this.state.location.coords.longitude }</Text>*/}
                </View>

                <View
                    style={{
                        flex: 1
                    }}
                >
                    <SafeAreaView
                        style={ styleGeneral.safeAreaView }
                    >
                    </SafeAreaView>

                    <View
                        style={{
                            paddingVertical: 11,
                            backgroundColor: 'white',
                            paddingHorizontal: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 15,
                            marginTop: 20,
                            borderRadius: 7,
                            elevation: 3,
                            shadowColor: 'grey',
                            shadowOffset: { width: 1.5, height: 1.5 },
                            shadowRadius: 2,
                            shadowOpacity: 0.35
                        }}
                    >
                        <TouchableOpacity 
                            onPress={navigation.openDrawer}
                        >
                            <Image
                                source={require('../../assets/icon_menu.png')}
                                style={{
                                    width: 22,
                                    height: 22,
                                }}
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                paddingHorizontal: 15
                            }}
                        >
                            <Text>
                                Noah Mitra
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingBottom: 50
                        }}
                    >
                        { this.state.stopwatchStart ? 
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    paddingHorizontal: 40,
                                    paddingTop: 15,
                                    elevation: 2,
                                    shadowColor: 'grey',
                                    shadowOffset: { width: 1.5, height: 1.5 },
                                    shadowRadius: 20,
                                    shadowOpacity: 0.35
                                }}
                            >
                                <Stopwatch 
                                    laps msecs 
                                    start={this.state.stopwatchStart}
                                    reset={this.state.stopwatchReset}
                                    options={options}
                                    getTime={this.getFormattedTime} 
                                />

                                <TouchableOpacity
                                    onPress={ this.End }
                                    style={{
                                        alignItems: 'center',
                                        paddingTop: 20,
                                        paddingBottom: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#666699',
                                            fontWeight: 'bold',
                                            letterSpacing: 2,
                                        }}
                                    >
                                        SELESAI
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        : null }

                        { !this.state.stopwatchStart ? 
                            <TouchableOpacity
                                onPress={ this.Start }
                                style={{
                                    backgroundColor: 'white',
                                    paddingHorizontal: 50,
                                    paddingVertical: 15,
                                    elevation: 2,
                                    shadowColor: 'grey',
                                    shadowOffset: { width: 1.5, height: 1.5 },
                                    shadowRadius: 20,
                                    shadowOpacity: 0.35
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#666699',
                                        fontWeight: 'bold',
                                        letterSpacing: 2,
                                    }}
                                >
                                    START
                                </Text>
                            </TouchableOpacity>
                        : null }
                        
                        { userPid == 1 ? 
                            <View>
                                <TouchableOpacity
                                    onPress={ this.ReadDir }
                                    style={{
                                        backgroundColor: 'white',
                                        paddingHorizontal: 50,
                                        paddingVertical: 15,
                                        elevation: 2,
                                        shadowColor: 'grey',
                                        shadowOffset: { width: 1.5, height: 1.5 },
                                        shadowRadius: 20,
                                        shadowOpacity: 0.35
                                    }}
                                    >
                                    <Text
                                        style={{
                                            color: '#666699',
                                            fontWeight: 'bold',
                                            letterSpacing: 2,
                                        }}
                                    >
                                        Read
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={ this.SendLocation }
                                    style={{
                                        backgroundColor: 'white',
                                        paddingHorizontal: 50,
                                        paddingVertical: 15,
                                        elevation: 2,
                                        shadowColor: 'grey',
                                        shadowOffset: { width: 1.5, height: 1.5 },
                                        shadowRadius: 20,
                                        shadowOpacity: 0.35
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#666699',
                                            fontWeight: 'bold',
                                            letterSpacing: 2,
                                        }}
                                    >
                                        SEND
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        : null }
                    </View>
                </View>
            </View>
        );
    }
}

const options = {
    container: {
        backgroundColor: '#000',
        padding: 5,
        borderRadius: 5,
        width: 220,
    },
    text: {
        fontSize: 30,
        color: '#FFF',
        marginLeft: 7,
    }
};

TaskManager.defineTask(LOCATION_TASK_NAME, async({ data, error }) => {
    if(error) {
        console.log(error);
        return;
    }
  
    if(data) {
        try {
            const { locations } = data;
            //console.log(locations);
            //console.log(SESSION_PID);
            let loc = locations[0].coords;
            let objLoc = {
                la: loc.latitude,
                lo: loc.longitude,
                al: loc.altitude,
                ts: locations[0].timestamp
            }

            arrLog.push(objLoc);

            /*await fetch(`${global.api}fetch_data`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        appToken: global.appToken,
                        table: 'insert_driver_log',
                        body: locations
                    })
                }
            ).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
            }).catch((error) => {
                console.error(error);
            });*/
        } catch(error) {
            console.log(LOCATION_TASK_NAME, error)
        }
    }
});