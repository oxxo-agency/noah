import React from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default class Home extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
		};
	}
    
    render() {
        let navigation = this.props.navigation;
        
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'blue',
                    paddingTop: 30,
                }}
            >
                <View>
                    <TouchableOpacity 
                        onPress={navigation.openDrawer}
                    >
                        <Text>Open Drawer</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red'
                        }}
                    >
                        <Text>
                            SCAN TO RIDE
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}