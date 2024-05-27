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
import DataItem from '../../../components/home/data/data-item';
import { DataType, Status, Template } from '../../../types/type';
import Typography from '../../../libs/typography';
import fontSize from '../../../themes/font-size';
import fontWeight from '../../../themes/font-weight';
import { navigateThroughStack } from '../../../navigation/root-navigation';
import { NewDataScreenProps, RootStackNewParamList } from '../../../navigation/param-types';

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
                headerTitle='Data dashboard'
                iconRight={<Image
                    source={require('assets/icons/add-nocircle-64px.png')}
                    style={{ width: 32, height: 32 }}
                    tintColor={Color.primary[700]}
                />}
                onPressRight={() => navigateThroughStack<NewDataScreenProps, RootStackNewParamList>('New', 'NewDataScreen')}
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
                            Active data
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
                            Inactive data
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