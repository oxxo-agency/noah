import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default class UnderConstruction extends React.Component {
    
    render() {
        let navigation = this.props.navigation;

        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Image
                    source={ require('../../assets/icon_under_construction.png') }
                    style={{
                        width: '60%'
                    }}
                    resizeMode='contain'
                />

                <View>
                    <Text
                        style={{
                            color: '#444444'
                        }}
                    >
                        Halaman sedang dalam konstruksi
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={ () => navigation.goBack() }
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 25,
                        marginTop: 25,
                        backgroundColor: '#fbc531',
                        borderRadius: 2,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: 'white'
                        }}
                    >
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

}