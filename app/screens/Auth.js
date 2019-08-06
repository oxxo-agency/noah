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
		
		try {
			const userPid = await AsyncStorage.getItem('userPid');
			//const userToken = await AsyncStorage.getItem('userToken');
			
			if(userPid !== null && userPid != '') {
				navigation.navigate('SignedIn');
			} else {
                navigation.navigate('SignedOut');
            }
		} catch(error) {
			console.log(error);
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