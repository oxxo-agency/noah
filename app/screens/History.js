import React from 'react';
import {
    Alert,
    AsyncStorage,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import LoadingScreen from './common/LoadingScreen';
import Header from './common/Header';
import { encrypt2, parseDate } from '../efunctions';

const styleGeneral = require('./styles/StyleGeneral');

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

export default class History extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            userPid: '',
            data: [],
            imgSrc: '',
            date_from: '',
            date_to: ''
        }
    }

    async getToken() {
        let userPid = await AsyncStorage.getItem('userPid');
        let projectPid = await AsyncStorage.getItem('projectPid');

        let { date_from, date_to } = this.state;

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
                    table: 'fetch_company_driver_report',
                    body: {
                        'pid': encrypt2(userPid),
                        'project_pid': encrypt2(projectPid),
                        'date_from': date_from,
                        'date_to': date_to
                    }
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);

                if(this.mounted) {
                    this.setState({
                        isLoading: false,
                        data: responseJson['data']
                    });
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

    _Enlarge = (imgSrc) => {
        this.setState({
            imgSrc: imgSrc
        });
    }

    _ShowHistory() {
        let that = this;

        if(this.state.data.log.length > 0) {
            let content = this.state.data.log.map(function(v, i) {
                return(
                    <View
                        key={ i }
                        style={{
                            borderBottomWidth: 1,
                            borderColor: '#e0e0e0',
                            paddingVertical: 10,
                        }}
                    >
                        <View>
                            <Text>
                                { parseDate(v.time_start) } - { parseDate(v.time_end) }
                            </Text>
                        </View>

                        <View
                            style={{
                                paddingVertical: 2,
                            }}
                        >
                            <Text>
                                { v.log_distance } KM
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingVertical: 10,
                            }}
                        >
                            <TouchableOpacity 
                                style={ styles.containerImg }
                                onPress={() => that._Enlarge(`${global.s3}driver/odo/${v.user_pid}/${v.odo_start}`)}
                            >
                                <Image 
                                    source={{uri: `${global.s3}driver/odo/${v.user_pid}/${v.odo_start}`}}
                                    style={ styles.imgOdo }
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={ styles.containerImg }
                                onPress={() => that._Enlarge(`${global.s3}driver/odo/${v.user_pid}/${v.odo_end}`)}
                            >
                                <Image 
                                    source={{uri: `${global.s3}driver/odo/${v.user_pid}/${v.odo_end}`}}
                                    style={ styles.imgOdo }
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            });

            return(content);
        } else {
            return(
                <View>
                    <Text>No Data.</Text>
                </View>
            );
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
                { this.state.imgSrc != '' ? 
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            zIndex: 5,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Image 
                            source={{uri: `${this.state.imgSrc}`}}
                            style={{
                                width: dWidth-20,
                                height: dWidth-20
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                : null }

                <Header
                    navigation={ navigation }
                    title='History'
                />

                <View>

                </View>

                <ScrollView
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 25,
                    }}
                >
                    { this._ShowHistory() }
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerImg: {
        width: dWidth/3,
        height: dWidth/3,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    imgOdo: {
        width: 125,
        height: 125,
    }
});