/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import Button from '../../libs/button';
import Color from '../../themes/color';
import Header from '../../libs/header';

const Home = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <Header headerTitle={'Home'} ></Header>
            <View></View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white[100],
        gap: 20
    },
    webViewContainer: {
        flex: 1,
    },
});

export default Home;