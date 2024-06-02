import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Color from '../../themes/color';
import Header from '../../libs/header';
import { StatusBar } from 'expo-status-bar';
import Card from '../../libs/card';
import { useDispatch } from 'react-redux';
import { openCenterModal } from '../../redux/slice/center-modal-slice';
import { decodeValue } from '../../utils/utils';
import Button from '../../libs/button';
import Typography from '../../libs/typography';
import fontSize from '../../themes/font-size';
import fontWeight from '../../themes/font-weight';
// import WifiManager from "react-native-wifi-reborn";
import { closeLoading, openLoading } from '../../redux/slice/loading-slice';
import { clearSettings, getSettings, restartDevice } from "../../services/wifi-ap-service";
import { openBottomModal } from '../../redux/slice/bottom-modal-slice';
import { navigate } from '../../navigation/root-navigation';
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";

export default function WifiApScreen() {
    const dispatch = useDispatch();
    const [currentSsid, setCurrentSsid] = useState<string>('');
    const [connecting, setConnecting] = useState<string>('');

    const getSettingsData = async () => {
        try {
            dispatch(openLoading());
            const res = await getSettings();
            const fields = res.data.split(',');
            setCurrentSsid(fields[0]);
        }
        catch (e) {
            console.log(e);
            dispatch(openCenterModal({
                isOpen: true,
                isFailed: true,
                title: 'Error',
                content: (e as Error).message,
                btnTitle: 'Close',
                btnCancelTitle: ''
            }))
        }
        finally {
            dispatch(closeLoading());
        }
    }

    // const getConnectingWifi = async () => {
    //     await WifiManager.getCurrentWifiSSID().then(
    //         res => setConnecting(res)
    //     )
    // }

    const handleClear = () => {
        dispatch(openCenterModal({
            isOpen: true,
            isFailed: false,
            title: 'Warning',
            content: 'Make sure that you want to clear all settings here? Others should be kept',
            btnTitle: 'Yes',
            callback: async () => {
                try {
                    dispatch(openLoading());
                    const res = await clearSettings();
                    dispatch(openBottomModal({
                        isOpen: true,
                        isFailed: false,
                        title: 'Successful',
                        content: res.data,
                        btnTitle: 'Close',
                        btnCancelTitle: ''
                    }));
                    await getSettingsData();
                }
                catch (e) {
                    console.log(e);
                    dispatch(openBottomModal({
                        isOpen: true,
                        isFailed: true,
                        title: 'Error',
                        content: (e as Error).message,
                        btnTitle: 'Close',
                        btnCancelTitle: ''
                    }))
                }
                finally {
                    dispatch(closeLoading());
                }
            },
            btnCancelTitle: 'Cancel',
        }))
    }

    const handleRestart = async () => {
        try {
            const res = await restartDevice();
            dispatch(openBottomModal({
                isOpen: true,
                isFailed: false,
                title: 'Successful',
                content: res.data,
                btnTitle: 'Close',
                btnCancelTitle: ''
            }))
        }
        catch (e) {
            console.log(e);
            dispatch(openBottomModal({
                isOpen: true,
                isFailed: true,
                title: 'Error',
                content: (e as Error).message,
                btnTitle: 'Close',
                btnCancelTitle: ''
            }))
        }
        finally {
        }

    }

    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.type === NetInfoStateType.wifi && state.isConnected) {
                setConnecting(state.details.ssid ?? '')
                // getConnectingWifi();
            }
        });

        return () => {
            // Unsubscribe
            unsubscribe();
        }
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                iconRight={
                    <View style={{ paddingRight: 8 }}>
                        <Image source={require('assets/icons/search-48px.png')} style={{ width: 24, height: 24 }} tintColor={Color.primary[700]} />
                    </View>
                }
                onPressRight={getSettingsData}
            // headerTitle='Wifi AP'
            />
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Card
                    style={{
                        width: '100%',
                        flex: 1,
                        marginTop: 5,
                        marginBottom: 20,
                        gap: 16,
                        justifyContent: 'space-between'
                    }}
                    pb={16}
                    pt={16}
                    pr={25}
                    pl={25}
                    bgColor={Color.white[100]}
                >
                    <View style={{ gap: 5 }}>
                        <Typography fontSize={fontSize.Gigantic} fontFamily={fontWeight.w700} textAlign='left' style={{ width: '50%' }}>
                            WiFi Adhoc
                        </Typography>
                        <Typography fontSize={fontSize.SuperTiny} fontFamily={fontWeight.w400} textAlign='left'>
                            Detect wifi network and permanent store ssid/password inside the device.
                        </Typography>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Card style={{ flexDirection: 'row', gap: 8 }} bgColor={Color.primary[100]}>
                            <Typography fontSize={fontSize.Tiny} fontFamily={fontWeight.w700} textAlign='left'>
                                {`Connected WiFi:`}
                            </Typography>
                            <Typography fontSize={fontSize.Tiny} fontFamily={fontWeight.w700} textAlign='left' color={Color.success[600]}>
                                {connecting}
                            </Typography>
                        </Card>
                        <View style={{ width: '100%' }}>
                            <Card style={{ flexDirection: 'row', gap: 8 }} bgColor='transparent' pl={0} pr={0}>
                                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w700} textAlign='left'>
                                    {`Device WiFi SSID:`}
                                </Typography>
                                {!!currentSsid && <Typography
                                    fontSize={fontSize.Small}
                                    fontFamily={fontWeight.w700}
                                    textAlign='left'
                                    color={Color.white[100]}
                                    style={{ backgroundColor: Color.success[600], paddingVertical: 6, paddingHorizontal: 16, borderRadius: 999 }}
                                >
                                    {currentSsid}
                                </Typography>}
                            </Card>
                            <View style={{ gap: 8, width: '100%' }}>
                                <Button
                                    onPress={() => navigate('WifiEnrollScreen')}
                                >
                                    Scan WiFi
                                </Button>
                                <Button
                                    secondary
                                    onPress={handleClear}
                                >
                                    Pure settings
                                </Button>
                                <Button
                                    highlight
                                    onPress={handleRestart}
                                >
                                    Restart
                                </Button>
                            </View>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        width: '75%'
    },
});
