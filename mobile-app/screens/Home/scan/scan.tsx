import React, { useEffect, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import { StatusBar } from 'expo-status-bar';
import Card from '../../../libs/card';
import { useDispatch } from 'react-redux';
import { openCenterModal } from '../../../redux/slice/center-modal-slice';
import { decodeValue } from '../../../utils/utils';
import Button from '../../../libs/button';
import Typography from '../../../libs/typography';
import fontSize from '../../../themes/font-size';
import fontWeight from '../../../themes/font-weight';
import WifiManager from "react-native-wifi-reborn";
import useBLE from '../../../hooks/useBLE';
import { navigateThroughStack } from '../../../navigation/root-navigation';
import { NewDeviceFillScreenProps, RootStackNewParamList } from '../../../navigation/param-types';
import { openBottomModal } from '../../../redux/slice/bottom-modal-slice';
import { State } from 'react-native-ble-plx';
import { closeLoading, openLoading } from '../../../redux/slice/loading-slice';

export default function ScanScreen() {
    const ref = useRef<Camera>(null);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [start, setStart] = useState(false);
    const [epdName, setEpdName] = useState('');
    const {
        bleManager,
        isEnabledBLELocation,
        connectToDevice
    } = useBLE(false);

    const dispatch = useDispatch();


    // if (isScanning) {
    //     return <View style={styles.container}>
    //         <ActivityIndicator size="large" />
    //     </View>
    // }

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <StatusBar backgroundColor={Color.white[100]} />
                    <Header
                        headerTitle='Scan QR'
                    />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                        <Typography
                            fontSize={fontSize.Medium}
                            fontFamily={fontWeight.w600}
                        >
                            We need your permission to show the camera
                        </Typography>
                        <Button
                            style={{ width: '70%' }}
                            onPress={requestPermission}
                            children="Grant permission"
                        />
                    </View>
                </View>
            </View>
        );
    }

    const handleScan = async (result) => {
        // console.log(result.data);
        ref.current?.pausePreview();
        try {
            const dataRaw = decodeValue(result.raw);
            const { type, ...data } = JSON.parse(dataRaw);

            if (!type) {
                throw Error('Invalid QR code');
            }

            dispatch(openCenterModal({
                isOpen: true,
                isFailed: false,
                title: 'Scan QR successfully',
                content: 'Do you want to connect to this device?',
                btnTitle: 'Continue',
                callback: async () => {
                    dispatch(openLoading());
                    try {
                        if (type === 'wifi') {
                            // Check ssid, pass is correct?
                            if (!data.ssid || !data.pass) {
                                throw Error('Invalid QR code');
                            }
                            const res = await WifiManager.connectToProtectedWifiSSID({ ssid: data.ssid, password: data.pass }).then(
                                () => {
                                    dispatch(closeLoading());
                                    console.log("Connected successfully!");
                                },
                                () => {
                                    dispatch(closeLoading());
                                    console.log("Connection failed!");
                                }
                            );
                        }
                        else if (type === 'bluetooth') {
                            if (!data.name) {
                                throw Error('Invalid QR code');
                            }

                            // Turn on Bluetooth and scan, connect device
                            const state = await bleManager.state();
                            if (state === 'PoweredOff') {
                                await bleManager.enable();
                            }

                            let timeout = setTimeout(() => {
                                bleManager.stopDeviceScan();
                                dispatch(openBottomModal({
                                    isOpen: true,
                                    isFailed: true,
                                    title: 'Cannot connect to device',
                                    content: 'Please, try to reset your Blutooth and Location services then try again.',
                                    btnTitle: 'Close',
                                    callback: () => ref.current?.resumePreview(),
                                    btnCancelTitle: ''
                                }));
                                dispatch(closeLoading());
                            }, 30 * 1000);

                            if (await isEnabledBLELocation() === false) {
                                dispatch(openBottomModal({
                                    isOpen: true,
                                    isFailed: true,
                                    title: 'Cannot connect to device',
                                    content: 'Please, try to reset your Blutooth and Location services then try again.',
                                    btnTitle: 'Close',
                                    callback: () => ref.current?.resumePreview(),
                                    btnCancelTitle: ''
                                }));
                                dispatch(closeLoading());
                            }

                            if (await bleManager.state() === State.PoweredOn) {
                                bleManager.startDeviceScan(null, null, async (error, device) => {
                                    if (error) {
                                        console.log(error);
                                        dispatch(closeLoading());
                                    }

                                    if (device?.name === data.name && !!device) {
                                        // Device found
                                        bleManager.stopDeviceScan();
                                        if (await connectToDevice(device)) {
                                            dispatch(openBottomModal({
                                                isOpen: true,
                                                isFailed: false,
                                                title: 'Successfully',
                                                content: `Connected to ${data.name}`,
                                                btnTitle: 'Close',
                                                callback: () => ref.current?.resumePreview(),
                                                btnCancelTitle: ''
                                            }));
                                            dispatch(closeLoading());
                                            navigateThroughStack<NewDeviceFillScreenProps, RootStackNewParamList>('New', 'NewDeviceFillScreen');
                                        }
                                        else {
                                            dispatch(closeLoading());
                                            dispatch(openBottomModal({
                                                isOpen: true,
                                                isFailed: true,
                                                title: 'Cannot connect to device',
                                                content: 'Please, try to reset your Blutooth and Location services then try again.',
                                                btnTitle: 'Close',
                                                callback: () => ref.current?.resumePreview(),
                                                btnCancelTitle: ''
                                            }))
                                        }

                                        clearTimeout(timeout);
                                    }
                                });
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                        dispatch(openCenterModal({
                            isOpen: true,
                            isFailed: false,
                            title: 'Invalid QR code',
                            content: 'Please, make sure scanned QR code is correct.',
                            btnTitle: 'Close',
                            callback: () => ref.current?.resumePreview(),
                            btnCancelTitle: ''
                        }));
                        dispatch(closeLoading());
                    }
                },
                btnCancelTitle: 'Cancel',
                callbackCancel: () => ref.current?.resumePreview(),
            }))
        }
        catch (e) {
            console.log(e);
            dispatch(openCenterModal({
                isOpen: true,
                isFailed: false,
                title: 'Invalid QR code',
                content: 'Please, make sure scanned QR code is correct.',
                btnTitle: 'Close',
                callback: () => ref.current?.resumePreview(),
                btnCancelTitle: ''
            }))
        }
    }

    return (
        <View style={styles.container}>
            {start ? <Camera
                ref={ref}
                ratio='4:3'
                style={styles.camera}
                type={CameraType.back}
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                }}
                onBarCodeScanned={handleScan}
            >
                <StatusBar backgroundColor={Color.white[100]} />
                <Header
                    headerTitle='Scan QR'
                />
            </Camera> :
                <View style={{ flexGrow: 1, backgroundColor: Color.black[100] }} >
                    <StatusBar backgroundColor={Color.white[100]} />
                    <Header
                        headerTitle='Scan QR'
                    />
                </View>
            }
            <Button
                style={{ position: 'absolute', width: "70%", bottom: 16 }}
                onPress={() => { setStart(!start) }}>
                {start ? "Stop" : "Start"}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.primary[100],
        justifyContent: 'center',
        alignItems: 'center'
    },
    camera: {
        flex: 1,
        // minHeight: 300
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
