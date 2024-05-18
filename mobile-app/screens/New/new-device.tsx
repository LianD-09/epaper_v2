/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    PermissionsAndroid,
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
import { Device } from 'react-native-ble-plx';
import useBLE from '../../hooks/useBLE';
import { requestBluetoothPermission } from '../../services/ble-services';

const NewDeviceScreen = ({ navigation, route }) => {
    const { mode } = route.params;

    const { allDevices, scanForPeripherals, connectToDevice, connectedDevice } = useBLE();

    useEffect(() => {
        requestBluetoothPermission();

    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='New device'
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
                        </View>
                    </Card>
                    <Card bgColor={Color.secondary[300]} gap={16} onPress={() => { scanForPeripherals(); }}>
                        <Typography fontSize={fontSize.Big} fontFamily={fontWeight.w700} >
                            Data
                        </Typography>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                            {allDevices.map((e, index) => {
                                return <Card onPress={() => {
                                    connectToDevice(e);
                                }} key={index} pressOpacity={0.6}>
                                    <Typography >{e.name}</Typography>
                                </Card>
                            }
                            )}
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

export default NewDeviceScreen;