import React from 'react';
import { AsyncStorage, Alert } from 'react-native';
import {
    Text,
    View
} from 'react-native';

export default class Auth extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			signedIn: false,
			checkedSignIn: false
		};
	}
	
	async getToken() {
        this.mounted = true;
		navigation = this.props.navigation;
		
		let d = new Date();
		let day = d.getDay();
	
		if(day == 2 || day == 5) {
			try {
				const userPid = await AsyncStorage.getItem('userPid');

				if(userPid !== null && userPid != '') {
					let driverReport;

					fetch(`${global.api}fetch_data`, {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							appToken: global.appToken,
							table: 'fetch_driver_report_status',
							body: {
								'pid': userPid
							}
						})
					}).then((response) => response.json())
					.then((responseJson) => {
						console.log(responseJson);
						
						if(responseJson['status'] == '200') {
							AsyncStorage.setItem('driverReport', responseJson['data']['report']);
							driverReport = responseJson['data']['report'];

							if(driverReport == '1') {
								navigation.navigate('SignedIn');
							} else {
								navigation.navigate('DriverReport');
							}
						}
					}).catch((error) => {
						console.error(error);
					});
				} else {
					navigation.navigate('SignedOut');
				}
			} catch(error) {
				console.log(error);
			}
		} else {
			navigation.navigate('SignedIn');
		}
	}
	
	componentDidMount() {
		this.getToken();
	}
	
	componentWillUnmount() {
		this.mounted = false;
	}
    
    render() {
        return(
            <View></View>
        );
    }

}