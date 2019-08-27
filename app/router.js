import React from 'react';
import { 
	AsyncStorage,
	Image, 
	ScrollView,
	Text,
	View
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer, createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';

import Auth from './screens/Auth';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Settings from './screens/Settings';

import DriverReport from './screens/DriverReport';
import DriverNew from './screens/DriverNew';

import { TouchableOpacity } from 'react-native-gesture-handler';

// SignedIn Screen
const SignedIn = createDrawerNavigator({
    Home: {
		screen: Home,
	},
	Profile: {
		screen: Profile,
	},
	History: {
		screen: Home,
	},
	Settings: {
		screen: Settings
	}
}, {
    hideStatusBar: true,
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    overlayColor: '#fff',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#cacaca',
	},
	initialRouteName: 'Home',
	contentComponent: (props) => (
		<View>
			<View 
				style={{
					alignItems: 'center', 
					justifyContent: 'center',
				}}
			>
				<TouchableOpacity
					style={{
						height: 150,
						justifyContent: 'center',
						marginTop: 50
					}}
					onPress={() => navigation.navigate('Profile')}
				>
					<Image
						source={ require('../assets/icon_profile.png') }
						style={{
							width: 100,
							height: 100
						}}
					/>
				</TouchableOpacity>

				<View
					style={{
						alignItems: 'flex-end',
						width: '100%',
						marginTop: 15,
						paddingHorizontal: 20,
						paddingVertical: 15,
					}}
				>
					<Text>
						12.350 Points
					</Text>
				</View>
			</View>

			<ScrollView>
				<DrawerItems {...props} />
			</ScrollView>
		</View>
	)
});

export const SignedInContainer = createAppContainer(SignedIn);

// SignedOut Screen
const SignedOut = createStackNavigator({
	SignIn: {
		screen: SignIn
	},
	SignUp: {
		screen: SignUp
	}
}, {
	headerMode: 'none',
	mode: 'modal',
});

export const SignedOutContainer = createAppContainer(SignedOut);

// Index Screen
const Index = createSwitchNavigator({
	Auth: {
		screen: Auth
	},
	SignedIn: {
		screen: SignedInContainer
	},
	SignedOut: {
		screen: SignedOutContainer
	},
	DriverReport: {
		screen: DriverReport
	},
	DriverNew: {
		screen: DriverNew
	}
}, {
	headerMode: 'none',
	mode: 'modal',
	initialRouteName: "Auth"
});

export const IndexContainer = createAppContainer(Index);

// Root
export const createRootNavigator = (signedIn) => {
	return IndexContainer;
}