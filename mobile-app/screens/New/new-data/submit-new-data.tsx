/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Card from '../../../libs/card';
import { StatusBar } from 'expo-status-bar';
import { DataRaw, DataType, DeviceRaw, Template } from '../../../types/type';
import Button from '../../../libs/button';
import Select from '../../../libs/select';
import { fonts, themes } from '../../../utils/constants';
import { SelectItem } from '../../../redux/types';
import { popToTop, replace } from '../../../navigation/root-navigation';
import { SubmitNewDataScreenProps } from '../../../navigation/param-types';
import useBLE from '../../../hooks/useBLE';
import { useDispatch } from 'react-redux';
import { closeLoading, openLoading } from '../../../redux/slice/loading-slice';
import { getActiveDevices } from '../../../services/device-services';
import { openBottomModal } from '../../../redux/slice/bottom-modal-slice';
import { createData, createDataNoMqtt } from '../../../services/data-services';
import { capitalize } from '../../../utils/utils';
import { openCenterModal } from '../../../redux/slice/center-modal-slice';

const fontList: Array<SelectItem> = fonts.map(e => {
    return {
        label: e.db,
        value: e.db,
    }
})
const themeList: Array<SelectItem> = themes.map(e => {
    return {
        label: e.db,
        value: e.db,
    }
})

const deviceMock: Array<SelectItem> = Array(5).fill(1).map((e, index) => {
    return {
        label: `Device-${index}`,
        value: index,
    }
})

const SubmitNewDataScreen = ({ navigation, route }) => {
    const dispacth = useDispatch();
    const { data, dataType } = route.params as SubmitNewDataScreenProps;
    const [device, setDevice] = useState<SelectItem | null>(null);
    const [font, setFont] = useState<SelectItem | null>(null);
    const [theme, setTheme] = useState<SelectItem | null>(null);
    const [activeDevices, setActiveDevices] = useState<DeviceRaw[]>([]);
    const {
        scanForPeripherals,
        connectToDevice,
        allDevices,
        connectedDevice,
        stopScanDevices,
        disconnectFromDevice,
        changeData,
        uniqueId,
        sendImage
    } = useBLE(false);


    const deviceList: SelectItem[] = useMemo(() => {
        const formatActives: Array<SelectItem> = activeDevices.map(e => ({
            label: e.name,
            value: e._id,
            type: 'mqtt',
        }));

        return !!connectedDevice ? [
            ...formatActives,
            {
                label: connectedDevice?.name,
                value: connectedDevice?.id,
                image: require('assets/icons/bluetooth-48px.png'),
                type: 'bluetooth'
            } as SelectItem,
            ...allDevices.map(e => {
                return {
                    label: e.name,
                    value: e.id,
                    image: require('assets/icons/bluetooth-48px.png'),
                    type: 'bluetooth'
                } as SelectItem
            })
        ] : [
            ...formatActives,
            ...allDevices.map(e => {
                return {
                    label: e.name,
                    value: e.id,
                    image: require('assets/icons/bluetooth-48px.png'),
                    type: 'bluetooth'
                } as SelectItem
            })
        ]
    }, [allDevices, connectedDevice, activeDevices]);

    const getAllActiveDevice = async () => {
        try {
            const res = await getActiveDevices();

            setActiveDevices(res.data.data);
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        switch (dataType) {
            case DataType.PRODUCT:
                break;
            case DataType.CLIENT:
                break;
            case DataType.EMPLOYEE:
                break;
            case DataType.ROOM:
                break;
            case DataType.STUDENT:
                break;
        }

        getAllActiveDevice();

        return () => {
            disconnectFromDevice();
        }
    }, []);

    const handleSubmit = async () => {
        let fontESP = fonts.find((value) => font?.value === value.db);
        let themeESP = themes.find((value) => theme?.value === value.db);
        try {
            dispacth(openLoading());
            // call api
            if (device?.type === 'bluetooth') {
                let check = 0;
                if (dataType === DataType.IMAGE) {
                    if (data.input2) {
                        check = await sendImage(data.input2);

                    }

                    if (check <= 0) {
                        dispacth(openCenterModal({
                            isOpen: true,
                            isFailed: true,
                            title: 'Error',
                            content: 'Cannot send image. Please try again.',
                            btnTitle: 'Close',
                            btnCancelTitle: ''
                        }));

                        return;
                    }
                }

                const res = await createDataNoMqtt({
                    ...data,
                    uniqueID: uniqueId,
                    fontStyle: font?.value as string,
                    designSchema: theme?.value as string,
                    type: capitalize(dataType),
                    active: true,
                    activeStartTime: -1,
                    deviceID: '',
                    deviceName: '',
                    activeTimestamp: []
                });

                await changeData(dataType, {
                    ...data,
                    input2: dataType === DataType.IMAGE ? '' : data.input2,
                    font: fontESP?.sign ?? fonts[3].sign,
                    schema: themeESP?.sign ?? themes[0].sign,
                    dataId: res.data.data._id.toString(),
                });

            }
            else {
                await createData({
                    ...data,
                    deviceID: device?.value as string,
                    deviceName: device?.label ?? "",
                    fontStyle: font?.value as string,
                    designSchema: theme?.value as string,
                    type: capitalize(dataType),
                    active: true,
                    activeStartTime: -1,
                    activeTimestamp: []
                })
            }
            dispacth(openBottomModal({
                isOpen: true,
                isFailed: false,
                title: 'Successful',
                content: 'This data has been created.',
                btnTitle: 'Close',
                callback: () => popToTop(),
                btnCancelTitle: ''
            }))
        }
        catch (e) {
            console.log(e);
            dispacth(openBottomModal({
                isOpen: true,
                isFailed: true,
                title: 'Failed',
                content: 'Something was wrong. Please try again.',
                btnTitle: 'Close',
                btnCancelTitle: ''
            }))
        }
        finally {
            dispacth(closeLoading());
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Data information'
            />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Card
                    style={{
                        width: '100%',
                        flex: 1,
                        marginTop: 5,
                        paddingBottom: 40,
                        gap: 16,
                        justifyContent: 'space-between'
                    }}
                    pb={16}
                    pt={16}
                    bgColor={Color.white[100]}
                >
                    <View style={{ gap: 16 }}>
                        <Select
                            value={device}
                            placeholder={'Select a device'}
                            label={'Device'}
                            items={deviceList}
                            onFocus={() => {
                                scanForPeripherals(true);
                            }}
                            onSelect={(item) => {
                                setDevice(item);
                                let device = allDevices.find((e) => e.id == item.value);
                                if (device) {
                                    connectToDevice(device)
                                }
                            }}
                            onBlur={() => {
                                stopScanDevices();
                            }}
                        />
                        {dataType !== DataType.IMAGE &&
                            <>
                                <Select
                                    value={font}
                                    placeholder={'Select a font'}
                                    label={'Font'}
                                    items={fontList}
                                    onSelect={setFont} />
                                <Select
                                    value={theme}
                                    placeholder={'Theme'}
                                    label={'Theme'}
                                    items={themeList}
                                    onSelect={setTheme} />
                            </>
                        }
                    </View>
                    <Button
                        onPress={handleSubmit}
                        disable={!device && !font && !theme}
                    >
                        Submit
                    </Button>
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
        flexGrow: 1,
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

export default SubmitNewDataScreen;