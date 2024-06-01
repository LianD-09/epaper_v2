/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Animated,
    Image,
    PermissionsAndroid,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Button from '../../../libs/button';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Typography from '../../../libs/typography';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { StatusBar } from 'expo-status-bar';
import Card from '../../../libs/card';
import { Device } from 'react-native-ble-plx';
import { requestBluetoothPermission } from '../../../services/ble-services';
import Divider from '../../../libs/divider';
import { navigate, navigationRef } from '../../../navigation/root-navigation';
import { NewDataFillScreenProps, NewDeviceFillScreenProps, RootStackNewParamList } from '../../../navigation/param-types';
import { DataType } from '../../../types/type';

const dataList = [
    {
        value: DataType.PRODUCT,
        title: 'Product',
        icon: require('assets/icons/product-128px.png'),
        color: Color.primary[600]
    },
    {
        value: DataType.STUDENT,
        title: 'Student',
        icon: require('assets/icons/student-128px.png'),
        color: Color.secondary[600]
    },
    {
        value: DataType.EMPLOYEE,
        title: 'Employee',
        icon: require('assets/icons/employee-128px.png'),
        color: Color.success[600]
    },
    {
        value: DataType.CLIENT,
        title: 'Client',
        icon: require('assets/icons/client-128px.png'),
        color: Color.info[600]
    },
    {
        value: DataType.ROOM,
        title: 'Room',
        icon: require('assets/icons/room-128px.png'),
        color: Color.orange[700]
    },
    {
        value: DataType.IMAGE,
        title: 'Image',
        icon: require('assets/icons/image-128px.png'),
        color: Color.purple[600]
    },
]

const NewDataScreen = ({ navigation, route }) => {

    const renderCardGrid = (nodes: Array<React.ReactNode>) => {
        const length = nodes.length;

        const rowCount = Math.ceil(length / 2);

        const rows = Array<React.ReactNode>(rowCount);

        for (let i = 0; i < rowCount; i++) {
            rows[i] = (
                <View key={i} style={{ gap: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {nodes[i * 2]}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {i * 2 + 1 < length && nodes[i * 2 + 1]}
                    </View>
                </View >
            )
        }

        return <View style={{ gap: 16, flexDirection: 'column', marginTop: 16 }}>
            {rows}
        </View>
    }

    useEffect(() => {
        requestBluetoothPermission();

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.main}>
                    <View style={{ gap: 5 }}>
                        <Typography fontSize={fontSize.Gigantic} fontFamily={fontWeight.w700} textAlign='left' style={{ width: '50%' }}>
                            Data Information
                        </Typography>
                        <Typography fontSize={fontSize.SuperTiny} fontFamily={fontWeight.w400} textAlign='left'>
                            First, choose the type of data to continue.
                        </Typography>
                    </View>
                    {renderCardGrid(dataList.map((e, index) => (
                        <Card
                            key={index}
                            style={{ minHeight: 150, justifyContent: 'space-between' }}
                            bgColor={e.color}
                            onPress={() => {
                                navigate<NewDataFillScreenProps, RootStackNewParamList>('NewDataFillScreen', { dataType: e.value })
                            }}
                            pressOpacity={0.6}
                        >
                            <Image source={e.icon} style={{ width: 48, height: 48 }} tintColor={Color.white[100]} />
                            <Typography color={Color.white[100]} fontFamily={fontWeight.w700} fontSize={fontSize.Big}>
                                {e.title}
                            </Typography>
                        </Card>
                    )))}

                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.primary[100],
        gap: 5
    },
    content: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: Color.white[100],
        borderRadius: 20
    },
    main: {
        paddingHorizontal: 25,
        gap: 16,
        width: '100%'
    }
});

export default NewDataScreen;