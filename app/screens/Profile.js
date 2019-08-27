import React from 'react';
import {
    AsyncStorage,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default class Profile extends React.Component {
    
    render() {
        return(
            <View
                style={{
                    flex: 1,
                    paddingTop: 200
                }}
            >
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            AsyncStorage.removeItem('userPid');
                            navigation.navigate('SignedOut');
                        }}
                        style={{
                            alignItems: 'center'
                        }}
                    >
                        <View>
					
                        </View>
        
                        <View>
                            <Text>
                                Log Out
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}