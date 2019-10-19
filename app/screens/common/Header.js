import React from 'react';
import { 
    ActivityIndicator, 
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
	View
} from 'react-native';

const Header = ({ navigation, title }) => (
    <SafeAreaView 
        forceInset={{ top: 'always', bottom: 'never' }}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 3,
            shadowColor: 'grey',
            shadowOffset: { width: 1.5, height: 1.5 },
            shadowRadius: 2,
            shadowOpacity: 0.35,
            backgroundColor: 'white'
        }}
    >
        <View
            style={{
                flex: 0.15,
                alignItems: 'center',
                paddingVertical: 10,
            }}
        >
            <TouchableOpacity 
                onPress={navigation.openDrawer}
            >
                <Image
                    source={require('../../../assets/icon_menu.png')}
                    style={{
                        width: 22,
                        height: 22,
                    }}
                />
            </TouchableOpacity>
        </View>

		<View
            style={{
                flex: 0.7,
                alignItems: 'center',
                paddingVertical: 10,
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#444444'
                }}
            >
                { title }
            </Text>
        </View>

        <View
            style={{
                flex: 0.15
            }}
        >
            
        </View>
	</SafeAreaView>
);

export default Header;

const styles = StyleSheet.create({
	containerLoadingScreen: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.5)'
	}
});