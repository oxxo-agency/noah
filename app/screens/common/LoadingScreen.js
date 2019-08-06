import React from 'react';
import { 
	ActivityIndicator, 
	StyleSheet,
	View
} from 'react-native';

const LoadingScreen = () => (
	<View style={ styles.containerLoadingScreen }>
		<ActivityIndicator />
	</View>
);

export default LoadingScreen;

const styles = StyleSheet.create({
	containerLoadingScreen: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.5)'
	}
});