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
import { DataRaw, DataType, Template } from '../../../types/type';
import Button from '../../../libs/button';
import Select from '../../../libs/select';
import { fonts, themes } from '../../../utils/constants';
import { SelectItem } from '../../../redux/types';
import { replace } from '../../../navigation/root-navigation';
import { SubmitNewDataScreenProps } from '../../../navigation/param-types';
import useBLE from '../../../hooks/useBLE';

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
    const { data, dataType } = route.params as SubmitNewDataScreenProps;
    const [device, setDevice] = useState<string | number | null>(null);
    const [font, setFont] = useState<string>('');
    const [theme, setTheme] = useState<string>('');
    const {
        scanForPeripherals,
        connectToDevice,
        allDevices,
        connectedDevice,
        stopScanDevices,
        changeData
    } = useBLE(false);

    const deviceList: SelectItem[] = useMemo(() => {
        return !!connectedDevice ? [
            ...deviceMock,
            {
                label: connectedDevice?.name,
                value: connectedDevice?.id,
                image: require('assets/icons/bluetooth-48px.png')
            } as SelectItem,
            ...allDevices.map(e => {
                return {
                    label: e.name,
                    value: e.id,
                    image: require('assets/icons/bluetooth-48px.png')
                } as SelectItem
            })
        ] : [
            ...deviceMock,
            ...allDevices.map(e => {
                return {
                    label: e.name,
                    value: e.id,
                    image: require('assets/icons/bluetooth-48px.png')
                } as SelectItem
            })
        ]
    }, [allDevices, connectedDevice]);

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
    }, []);

    const handleSubmit = async () => {
        let fontESP = fonts.find((value) => font === value.db);
        let themeESP = themes.find((value) => theme === value.db);
        // call api
        changeData(dataType, {
            ...data,
            font: fontESP?.sign ?? fonts[3].sign,
            schema: themeESP?.sign ?? themes[0].sign,
        })
        // replace('DataScreen');
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
                            onSelect={(value) => {
                                setDevice(value);
                                let device = allDevices.find((e) => e.id == value);
                                if (device) {
                                    connectToDevice(device)
                                }
                            }}
                            onBlur={() => {
                                stopScanDevices();
                            }}
                        />
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