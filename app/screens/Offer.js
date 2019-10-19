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

import { addDot, parseOfferType } from '../efunctions';

export default class Offer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: [],
            userPid: '',
            projectPid: ''
        }
    }

    async getToken() {
        try {
            let userPid = await AsyncStorage.getItem('userPid');
            let projectPid = await AsyncStorage.getItem('projectPid');
            const navigation = this.props.navigation;

			// Fetch offer
			fetch(`${global.api}fetch_data`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appToken: global.appToken,
                    table: 'fetch_driver_offer',
                    body: ''
				})
			}).then((response) => response.json())
			.then((responseJson) => {
                console.log(responseJson);
                
                if(responseJson['status'] == '200') {
					if(this.mounted) {
						this.setState({
							isLoading: false,
                            data: responseJson['data']['offer'],
                            userPid: userPid,
                            projectPid: projectPid
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

    _ShowOffer = () => {
        if(this.state.data.length > 0) {
            let content = this.state.data.map(function(v, i) {
                return(
                    <View
                        key={ i }
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 10
                        }}
                    >
                        <View>
                            <Text style={{
                                fontWeight: 'bold'
                            }}>
                                { v.project_offer_title }
                            </Text>
                        </View>

                        <View style={ styles.offerRow }>
                            <View style={ styles.offerLabel }>
                                <Text style={ styles.txtLabel }>
                                    Jangka Waktu
                                </Text>
                            </View>

                            <View style={ styles.offerValue }>
                                <Text style={ styles.txtValue }>
                                    { v.project_offer_period } Bulan
                                </Text>
                            </View>
                        </View>

                        <View style={ styles.offerRow }>
                            <View style={ styles.offerLabel }>
                                <Text style={ styles.txtLabel }>
                                    Insentif
                                </Text>
                            </View>

                            <View style={ styles.offerValue }>
                                <Text style={ styles.txtValue }>
                                    Rp. { addDot(v.project_offer_amount) }
                                </Text>
                            </View>
                        </View>

                        <View style={ styles.offerRow }>
                            <View style={ styles.offerLabel }>
                                <Text style={ styles.txtLabel }>
                                    Tipe
                                </Text>
                            </View>

                            <View style={ styles.offerValue }>
                                <Text style={ styles.txtValue }>
                                    { parseOfferType(v.project_offer_type) }
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            });

            return(content);
        } else {
            return(
                <View>
                    <Text>
                        Belum ada penawaran untuk saat ini
                    </Text>
                </View>
            )
        }
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
                    title='Penawaran'
                />

                <View>
                    { this._ShowOffer() }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    offerRow: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    offerLabel: {
        flex: 0.3
    }
});