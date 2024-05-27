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
import { DataType, Status, Template } from '../../../types/type';
import DevicesItem from '../../../components/home/devices/devices-item';
import Typography from '../../../libs/typography';
import fontSize from '../../../themes/font-size';
import fontWeight from '../../../themes/font-weight';
import { navigateThroughStack } from '../../../navigation/root-navigation';
import { NewDeviceScreenProps, RootStackNewParamList } from '../../../navigation/param-types';

const mockdata = [
    {
        id: 1,
        name: 'EPD 01',
        status: Status.ACTIVE,
        dataType: DataType.PRODUCT,
        dataId: 1,
        dataName: 'Thịt gà Minh',
        ssid: 'Do Ngoc',
        pass: '12345678',
        createdBy: 1,
    },
    {
        id: 2,
        name: 'EPD 02',
        status: Status.INACTIVE,
        dataType: DataType.STUDENT,
        dataId: 1,
        dataName: 'Linh DA',
        ssid: 'Do Ngoc',
        pass: '12345678',
        createdBy: 1,
    },
    {
        id: 3,
        name: 'EPD 03',
        status: Status.ACTIVE,
        dataType: DataType.EMPLOYEE,
        dataId: 1,
        dataName: 'Minh',
        ssid: 'Do Ngoc',
        pass: '12345678',
        createdBy: 1,
    },
    {
        id: 4,
        name: 'EPD 04',
        status: Status.ACTIVE,
        dataType: DataType.CLIENT,
        dataId: 1,
        dataName: 'Minh Linh',
        ssid: 'Do Ngoc',
        pass: '12345678',
        createdBy: 1,
    },
    {
        id: 5,
        name: 'EPD 05',
        status: Status.ACTIVE,
        dataType: DataType.ROOM,
        dataId: 1,
        dataName: '1208B',
        ssid: 'Do Ngoc',
        pass: '12345678',
        createdBy: 1,
    },
]

const DevicesScreen = ({ navigation }) => {
    const { active, inactive } = useMemo(() => {
        return {
            active: mockdata.filter((e, index) => e.status === Status.ACTIVE),
            inactive: mockdata.filter((e, index) => e.status === Status.INACTIVE)
        }
    }, [mockdata])

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
                    {mockdata.map((e, index) => <DevicesItem key={index} {...e}></DevicesItem>)}
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