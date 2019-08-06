import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';

import Auth from './screens/Auth';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';

// SignedIn Screen
const SignedIn = createDrawerNavigator({
    Home: {
		screen: Home,
	},
}, {
    hideStatusBar: true,
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    overlayColor: '#6b52ae',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
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