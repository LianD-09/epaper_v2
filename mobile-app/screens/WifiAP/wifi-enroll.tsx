import React, { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import WifiManager from "react-native-wifi-reborn";
import { closeLoading, openLoading } from '../../redux/slice/loading-slice';
import { clearSettings, getScannedWifi, restartDevice } from "../../services/wifi-ap-service";
import { openBottomModal } from '../../redux/slice/bottom-modal-slice';
import { navigate } from '../../navigation/root-navigation';
import Divider from '../../libs/divider';
import { RootStackWifiApParamList, WifiFillScreenProps } from '../../navigation/param-types';

type ScanItem = { ssid: string, rssi: string }

export default function WifiEnrollScreen() {
    const dispatch = useDispatch();
    const [connecting, setConnecting] = useState<string>('');
    const [isScanning, setIsScanning] = useState(false);
    const [items, setItems] = useState<Array<ScanItem>>([])
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

    const getScanData = async () => {
        try {
            // dispatch(openLoading());
            const res = await getScannedWifi();
            const fields = res.data.split(',');
            let list: ScanItem[] = [];
            for (let i = 0; i < fields.length; i += 2) {
                list.push({
                    ssid: fields[i],
                    rssi: fields[i + 1],
                })
            }

            setItems(list);
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
            setIsScanning(false);
            // dispatch(closeLoading());
        }
    }

    const getConnectingWifi = async () => {
        await WifiManager.getCurrentWifiSSID().then(
            res => setConnecting(res)
        )
    }

    useEffect(() => {
        getConnectingWifi();
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
            // headerTitle='WiFi networks'
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
                    }}
                    pb={16}
                    pt={16}
                    pr={25}
                    pl={25}
                    bgColor={Color.white[100]}
                >
                    <View style={{ gap: 5 }}>
                        <Typography fontSize={fontSize.Gigantic} fontFamily={fontWeight.w700} textAlign='left' style={{ width: '70%' }}>
                            WiFi Networks
                        </Typography>
                        <Typography fontSize={fontSize.SuperTiny} fontFamily={fontWeight.w400} textAlign='left'>
                            Select an WiFi SSID and save its password.
                        </Typography>
                    </View>
                    <Card style={{ flexDirection: 'row', gap: 8 }} bgColor={Color.primary[100]}>
                        <Typography fontSize={fontSize.Tiny} fontFamily={fontWeight.w700} textAlign='left'>
                            {`Connected WiFi:`}
                        </Typography>
                        <Typography fontSize={fontSize.Tiny} fontFamily={fontWeight.w700} textAlign='left' color={Color.success[600]}>
                            {connecting}
                        </Typography>
                    </Card>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4, width: '100%', padding: 10 }}>
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
                                        getScanData();
                                        setIsScanning(true);
                                    }
                                }}
                            >
                                <Image
                                    source={require("assets/icons/wifi-512px.png")}
                                    style={{
                                        width: 170, height: 170,
                                        backgroundColor: Color.white[100],
                                        borderRadius: 999
                                    }}
                                    tintColor={Color.primary[900]}
                                />
                            </Pressable>
                        </View>
                        <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w700} >
                            {isScanning ? "Looking for WiFi access points..." : "Press WiFi icon to scan"}
                        </Typography>
                        <Divider bdStyle='solid' width={'50%'} />
                        <Typography fontSize={fontSize.Tiny} fontFamily={fontWeight.w400} >
                            {'Choose the WiFi access points from the list below to continue'}
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
                            WiFi networks found: {items.length}
                        </Typography>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'column',
                                gap: 5,
                            }}
                        >
                            {items.map((e, index) => {
                                return (
                                    <Card
                                        onPress={() => {
                                            setIsScanning(false);
                                            navigate<WifiFillScreenProps, RootStackWifiApParamList>('WifiFillScreen', e);
                                        }}
                                        key={index}
                                        pressOpacity={0.6}
                                        style={{
                                            flexDirection: 'row',
                                            gap: 16,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Image source={require('assets/icons/wifi-64px.png')} style={{ width: 24, height: 24 }} />
                                        <View style={{ flexDirection: 'column', gap: 4 }}>
                                            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w700}>{e.ssid}</Typography>
                                            <Typography fontSize={fontSize.SuperTiny} fontFamily={fontWeight.w500}>{`S/N: ${e.rssi}`}</Typography>
                                        </View>
                                    </Card>
                                )
                            })}

                        </View>
                    </Card>
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
