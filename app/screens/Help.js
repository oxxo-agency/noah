import React from 'react';
import {
    Text,
    View
} from 'react-native';

export default class Help extends React.Component {
    
    render() {
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'red'
                }}
            >
                <View>
                    <Text>
                        Sign In
                    </Text>
                </View>
            </View>
        );
    }

}