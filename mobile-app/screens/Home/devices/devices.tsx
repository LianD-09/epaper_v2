/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Button from '../../../libs/button';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Typography from '../../../libs/typography';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import HomeCard from '../../../components/home/home-card';


const DevicesScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <Header
                iconLeft={
                    <Image source={require('assets/icons/action-48px.png')} style={{ width: 32, height: 32 }} tintColor={Color.primary[700]} />
                }
                iconRight={
                    <Image source={require('assets/icons/profile-48px.png')} style={{ width: 32, height: 32 }} tintColor={Color.primary[700]} />
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white[100],
        paddingHorizontal: 25,
    },
    content: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20,
        paddingHorizontal: 25,
        paddingVertical: 20
    }
});

export default DevicesScreen;
;