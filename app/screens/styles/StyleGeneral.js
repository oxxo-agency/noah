'use strict';
import {
    Dimensions,
    Platform
} from 'react-native';

import globalConst from '../../globalConst';

var React = require('react-native');

var { StyleSheet } = React;

const dimensions = Dimensions.get('window');
const dWidth = dimensions.width;

module.exports = StyleSheet.create({
    safeAreaView: {
        backgroundColor: globalConst.COLOR.SAFEAREA,
        ...Platform.select({
            android: {
                paddingTop: 30
            }
        })
    },
    safeAreaView2: {
        backgroundColor: globalConst.COLOR.SAFEAREA,
        ...Platform.select({
            android: {
                paddingTop: 30
            }
        })
    },
    btnOrange: {
        backgroundColor: 'orange',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    txtBtnOrange: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});