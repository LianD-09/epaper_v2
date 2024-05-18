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
import Button from '../../libs/button';
import Color from '../../themes/color';
import Header from '../../libs/header';
import Typography from '../../libs/typography';
import fontWeight from '../../themes/font-weight';
import fontSize from '../../themes/font-size';
import { StatusBar } from 'expo-status-bar';
import Card from '../../libs/card';
import NewItem from '../../components/new/new-item';
import { navigate } from '../../navigation/root-navigation';
import { NewDataScreenProps, NewDeviceScreenProps, RootStackNewParamList } from '../../navigation/param-types';

const deviceModes = [
    {
        color: Color.info[600],
        label: 'Bluetooth connect',
        icon: <Image source={require('assets/icons/bluetooth-48px.png')} style={{ width: 24, height: 24 }} tintColor={Color.white[100]} />,
        onPress: () => navigate<NewDeviceScreenProps, RootStackNewParamList>('NewDeviceScreen', { mode: 'bluetooth' }),
    },
    {
        color: Color.success[600],
        label: 'Wifi devices connect',
        icon: <Image source={require('assets/icons/wifi-epd-48px.png')} style={{ width: 24, height: 24 }} tintColor={Color.white[100]} />,
        onPress: () => navigate<NewDeviceScreenProps, RootStackNewParamList>('NewDeviceScreen', { mode: 'adhoc' }),
    }
]

const dataModes = [
    {
        color: Color.purple[600],
        label: 'Product',
        onPress: () => null,
    },
    {
        color: Color.orange[700],
        label: 'Student',
        onPress: () => null,
    },
    {
        color: Color.success[500],
        label: 'Employee',
        onPress: () => null,
    },
    {
        color: Color.primary[600],
        label: 'Client',
        onPress: () => null,
    },
    {
        color: Color.info[500],
        label: 'Room',
        onPress: () => null,
    }
]

const NewMainScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='New device and data'
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.main}>
                    <Card bgColor={Color.primary[700]} gap={16}>
                        <Typography fontSize={fontSize.Big} fontFamily={fontWeight.w700} color={Color.white[100]}>
                            Device
                        </Typography>
                        <View style={{
                            width: '100%',
                            flexDirection: 'column',
                            gap: 5,
                        }}>
                            {deviceModes.map((e, index) => {
                                return <NewItem {...e} key={index} />
                            })}
                        </View>
                    </Card>
                    <Card bgColor={Color.secondary[300]} gap={16}>
                        <Typography fontSize={fontSize.Big} fontFamily={fontWeight.w700} >
                            Data
                        </Typography>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                            {dataModes.map((e, index) => {
                                return <NewItem {...e} key={index} />
                            })}
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.primary[100],
        gap: 5
    },
    content: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: Color.white[100],
        borderRadius: 20
    },
    main: {
        paddingHorizontal: 25,
        gap: 16,
        width: '100%'
    }
});

export default NewMainScreen;