/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Animated,
    Image,
    PermissionsAndroid,
    Pressable,
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
import { StatusBar } from 'expo-status-bar';
import Card from '../../../libs/card';
import { Device } from 'react-native-ble-plx';
import useBLE from '../../../hooks/useBLE';
import { requestBluetoothPermission } from '../../../services/ble-services';
import Divider from '../../../libs/divider';
import { navigate, navigationRef } from '../../../navigation/root-navigation';
import { NewDeviceFillScreenProps, RootStackNewParamList } from '../../../navigation/param-types';
import { useDispatch } from 'react-redux';
import { openCenterModal } from '../../../redux/slice/center-modal-slice';
import { wifiServiceAndCharacteristic } from '../../../utils/constants';

const NewDeviceScreen = ({ navigation, route }) => {
    const { mode } = route.params;
    const dispacth = useDispatch();
    const animated = useMemo(() => new Animated.Value(0), []);
    const animated2 = useMemo(() => new Animated.Value(0), []);
    const opacity = useMemo(() => new Animated.Value(1), []);
    const opacity2 = useMemo(() => new Animated.Value(1), []);

    const animationComposit = useMemo(() => Animated.loop(
        Animated.stagger(600, [
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(animated, {
                    toValue: 1.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(opacity2, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(animated2, {
                    toValue: 1.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ])
    ), []);

    const {
        allDevices,
        scanForPeripherals,
        connectToDevice,
        changeCharacteristicsValue,
        isScanning,
    } = useBLE();

    const handleConnect = async (e: Device) => {
        try {
            const connected = await connectToDevice(e);
            if (connected) {
                dispacth(openCenterModal({
                    isOpen: true,
                    isFailed: false,
                    title: 'Successful',
                    content: `Connected to ${e?.name}.`,
                    btnTitle: 'Next',
                    callback: () => navigate<NewDeviceFillScreenProps, RootStackNewParamList>('NewDeviceFillScreen', {}),
                    btnCancelTitle: 'Reset device',
                    callbackCancel: async () => {
                        await changeCharacteristicsValue(
                            wifiServiceAndCharacteristic.uuid,
                            wifiServiceAndCharacteristic.characteristics.restart,
                            "1",
                            false
                        );
                    }
                }))
            }
        }
        catch (err) {
            console.log(err);
            dispacth(openCenterModal({
                isOpen: true,
                isFailed: true,
                title: 'Error',
                content: `Connect to ${e?.name} failed`,
                btnTitle: 'Close',
                btnCancelTitle: '',
            }))
        }
    }

    useEffect(() => {
        requestBluetoothPermission();

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
            // headerTitle='New device'
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.main}>
                    <View style={{ gap: 5 }}>
                        <Typography fontSize={fontSize.Gigantic} fontFamily={fontWeight.w700} textAlign='left' style={{ width: '50%' }}>
                            New Device
                        </Typography>
                        <Typography fontSize={fontSize.SuperTiny} fontFamily={fontWeight.w400} textAlign='left'>
                            Make sure the ESP device is powered on and its Bluetooth is enabled. If cannot scan, turn off and turn on your Bluetooth.
                        </Typography>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 4, width: '100%', padding: 10 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: 256, height: 256, marginBottom: 12 }}>
                            {isScanning && <>
                                <Animated.View
                                    style={{
                                        width: 170,
                                        height: 170,
                                        borderRadius: 999,
                                        position: 'absolute',
                                        backgroundColor: Color.white[700],
                                        opacity: opacity,
                                        borderWidth: 1,
                                        transform: [
                                            {
                                                scale: animated
                                            }
                                        ]
                                    }} />
                                <Animated.View
                                    style={{
                                        width: 170,
                                        height: 170,
                                        borderRadius: 999,
                                        position: 'absolute',
                                        backgroundColor: Color.white[700],
                                        opacity: opacity2,
                                        borderWidth: 1,
                                        transform: [
                                            {
                                                scale: animated2
                                            }
                                        ]
                                    }} />
                            </>}
                            <Pressable
                                onPress={() => {
                                    if (!isScanning) {
                                        animationComposit.start();
                                        scanForPeripherals(true);
                                    }
                                }}
                            >
                                <Image
                                    source={require("assets/icons/bluetooth-512px.png")}
                                    style={{
                                        width: 170, height: 170,
                                        backgroundColor: Color.white[100],
                                        borderRadius: 999
                                    }}
                                />
                            </Pressable>
                        </View>
                        <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w700} >
                            {isScanning ? "Looking for Bluetooth devices..." : "Press Bluetooth icon to scan"}
                        </Typography>
                        <Divider bdStyle='solid' width={'50%'} />
                        <Typography fontSize={fontSize.Tiny} fontFamily={fontWeight.w400} >
                            {'Choose the EPD device from the list below to continue'}
                        </Typography>
                    </View>
                    <Card
                        bgColor={Color.white[100]}
                        gap={12}
                        pl={0}
                        pr={0}
                        onPress={() => {
                            animationComposit.stop()
                        }}
                    >
                        <Typography fontSize={fontSize.VeryTiny} fontFamily={fontWeight.w700} >
                            Device found: {allDevices.length}
                        </Typography>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                            {allDevices.map((e, index) => {
                                return (
                                    <Card
                                        onPress={() => handleConnect(e)}
                                        key={index}
                                        pressOpacity={0.6}
                                        style={{
                                            flexDirection: 'row',
                                            gap: 16,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Image source={require('assets/icons/device-48px.png')} style={{ width: 24, height: 24 }} />
                                        <View style={{ flexDirection: 'column', gap: 4 }}>
                                            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w700}>{e.name}</Typography>
                                            <Typography fontSize={fontSize.SuperTiny} fontFamily={fontWeight.w500}>{e.id}</Typography>
                                        </View>
                                    </Card>
                                )
                            })}
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView >
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