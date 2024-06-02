/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Card from '../../../libs/card';
import { StatusBar } from 'expo-status-bar';
import { DataType, Device, DeviceRaw, Status, Template } from '../../../types/type';
import DevicesItem from '../../../components/home/devices/devices-item';
import Typography from '../../../libs/typography';
import fontSize from '../../../themes/font-size';
import fontWeight from '../../../themes/font-weight';
import { navigateThroughStack, navigationRef } from '../../../navigation/root-navigation';
import { NewDeviceScreenProps, RootStackNewParamList } from '../../../navigation/param-types';
import { useDispatch } from 'react-redux';
import { getAllDevices } from '../../../services/device-services';
import { openCenterModal } from '../../../redux/slice/center-modal-slice';
import { AxiosError } from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const DevicesScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [devices, setDevices] = useState<Array<DeviceRaw>>([]);
    const [isFetching, setIsFetching] = useState(false);

    const { active, inactive } = useMemo(() => {
        return {
            active: devices.filter((e, index) => e.active === true),
            inactive: devices.filter((e, index) => e.active === false)
        }
    }, [devices]);

    const formatDevices = useMemo(() => {
        return devices.map((e, index) => ({
            id: e._id,
            name: e.name,
            status: e.active ? Status.ACTIVE : Status.INACTIVE,
            dataId: e.dataID,
            dataName: e.dataName,
            ssid: e.ssid,
            pass: e.pass,
            createdBy: e.createdBy,
            uniqueID: e.uniqueID
        }))
    }, [devices])

    const getDevices = async () => {
        try {
            setIsFetching(true);
            const allDevices = await getAllDevices();
            setDevices(allDevices.data.data);
        }
        catch (e) {
            dispatch(openCenterModal({
                isOpen: true,
                isFailed: true,
                title: 'Fetch devices and data failed',
                content: (e as AxiosError).message,
                btnTitle: 'Close',
                btnCancelTitle: ''
            }));
        }
        finally {
            setIsFetching(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getDevices()
            return () => { };
        }, [])
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Devices dashboard'
                iconRight={<Image
                    source={require('assets/icons/add-nocircle-64px.png')}
                    style={{ width: 32, height: 32 }}
                    tintColor={Color.primary[700]}
                />}
                onPressRight={() => navigateThroughStack<NewDeviceScreenProps, RootStackNewParamList>('New', 'NewDeviceScreen', { mode: 'bluetooth' })}
            />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Card style={{
                    width: '100%',
                    marginTop: 5,
                    paddingBottom: 10,
                    flexDirection: 'row'
                }}
                    pb={16}
                    pt={16}
                    bgColor={'transparent'}
                >
                    <Card
                        style={{ flex: 1, gap: 16 }}
                        bgColor={Color.success[500]}
                    >
                        <Typography
                            fontSize={fontSize.SuperTiny}
                            fontFamily={fontWeight.w700}
                            color={Color.white[100]}
                        >
                            Active devices
                        </Typography>
                        <Typography
                            fontSize={fontSize.Gigantic}
                            fontFamily={fontWeight.w700}
                            color={Color.white[100]}
                        >
                            {active.length < 10 ? `0${active.length}` : active.length}
                        </Typography>
                    </Card>
                    <Card
                        style={{ flex: 1, gap: 16 }}
                        bgColor={Color.error[700]}
                    >
                        <Typography
                            fontSize={fontSize.SuperTiny}
                            fontFamily={fontWeight.w700}
                            color={Color.white[100]}
                        >
                            Inactive devices
                        </Typography>

                        <Typography
                            fontSize={fontSize.Gigantic}
                            fontFamily={fontWeight.w700}
                            color={Color.white[100]}
                        >
                            {inactive.length < 10 ? `0${inactive.length}` : inactive.length}
                        </Typography>
                    </Card>
                </Card>
                <Card style={{
                    width: '100%',
                    flex: 1,
                    marginTop: 5,
                    paddingBottom: 40,
                }}
                    pb={16}
                    pt={16}
                    bgColor={Color.white[100]}
                >
                    <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w700} style={{ marginBottom: 8 }}>All devices:</Typography>
                    {formatDevices.length > 0 && !isFetching ?
                        formatDevices.map((e, index) => <DevicesItem key={index} {...e} dataId={e.dataId ?? ''} dataName={e.dataName ?? ''} createdBy={e.createdBy ?? ''} />) :
                        isFetching ?
                            <Typography fontSize={fontSize.VeryTiny} fontFamily={fontWeight.w500} > Getting devices...</Typography> :
                            <Typography fontSize={fontSize.VeryTiny} fontFamily={fontWeight.w500} > No devices found</Typography>
                    }
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.primary[100],
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
    },
    mainContainer: {
        backgroundColor: Color.white[100],
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        width: '100%'
    }

});

export default DevicesScreen;