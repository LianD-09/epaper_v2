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
import DataItem from '../../../components/home/data/data-item';
import { DataType, Status, Template } from '../../../types/type';

const mockdata = [
    {
        id: 1,
        name: 'Thịt gà Minh',
        deviceName: 'EPD 01',
        status: Status.ACTIVE,
        dataType: DataType.PRODUCT,
        data: {
            id: 1,
            name: 'Thịt gà Minh',
            category: 'Thực phẩm',
            price: '10000',
            active: true,
            activeStartTime: 1715438397,
            deviceName: 'EPD 01',
            deviceID: 1,
            activeTimestamp: [],
            fontStyle: 'Monospace 12pt',
            designSchema: 'Theme 1',
            createdBy: 1,
        }
    },
    {
        id: 2,
        name: 'Linh DA',
        deviceName: 'EPD 01',
        status: Status.INACTIVE,
        dataType: DataType.STUDENT,
        data: {
            id: 1,
            name: 'Linh DA',
            email: 'linh@gmail.com',
            studentId: '20194314',
            class: 'IT2-02',
            active: false,
            activeStartTime: 1715438397,
            deviceName: 'EPD 01',
            deviceID: 1,
            activeTimestamp: [],
            fontStyle: 'Monospace 12pt',
            designSchema: 'Theme 1',
            createdBy: 1,
        }
    },
    {
        id: 3,
        name: 'Minh',
        deviceName: 'EPD 01',
        status: Status.INACTIVE,
        dataType: DataType.EMPLOYEE,
        data: {
            id: 1,
            name: 'Minh',
            email: 'linh@gmail.com',
            employeeId: '20194333',
            department: '8B',
            active: false,
            activeStartTime: 1715438397,
            deviceName: 'EPD 01',
            deviceID: 1,
            activeTimestamp: [],
            fontStyle: 'Monospace 12pt',
            designSchema: 'Theme 1',
            createdBy: 1,
        }
    },
    {
        id: 4,
        name: 'Minh Linh',
        deviceName: 'EPD 01',
        status: Status.UNKNOWN,
        dataType: DataType.CLIENT,
        data: {
            id: 1,
            name: 'Minh Linh',
            email: 'linh@gmail.com',
            address: '141/7 - 8B',
            active: false,
            activeStartTime: 1715438397,
            deviceName: 'EPD 01',
            deviceID: 1,
            activeTimestamp: [],
            fontStyle: 'Monospace 12pt',
            designSchema: 'Theme 1',
            createdBy: 1,
        }
    },
    {
        id: 5,
        name: '1208B',
        deviceName: 'EPD 01',
        status: Status.ACTIVE,
        dataType: DataType.ROOM,
        data: {
            id: 1,
            name: '1208B',
            email: 'linh@gmail.com',
            purpose: 'Lao động',
            manager: 'Linh DA',
            roomStatus: 'Khả dụng',
            active: true,
            activeStartTime: 1715438397,
            deviceName: 'EPD 01',
            deviceID: 1,
            activeTimestamp: [],
            fontStyle: 'Monospace 12pt',
            designSchema: 'Theme 1',
            createdBy: 1,
        }
    },
]

const DataScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Data dashboard'
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
                    {mockdata.map((e, index) => <DataItem {...e} key={index} />)}
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

export default DataScreen;