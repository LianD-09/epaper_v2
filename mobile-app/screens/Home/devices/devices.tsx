/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
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

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Devices dashboard'
            />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
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