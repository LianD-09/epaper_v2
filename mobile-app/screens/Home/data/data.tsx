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
import { DataType, Status } from '../../../types/type';

const mockdata = [
    {
        name: 'Thịt gà Minh',
        deviceName: 'EPD 01',
        status: Status.ACTIVE,
        dataType: DataType.PRODUCT,
    },
    {
        name: 'Thịt gà Minh',
        deviceName: 'EPD 01',
        status: Status.INACTIVE,
        dataType: DataType.PRODUCT,
    },
    {
        name: 'Thịt gà Minh',
        deviceName: 'EPD 01',
        status: Status.PENDING,
        dataType: DataType.PRODUCT,
    },
    {
        name: 'Thịt gà Minh',
        deviceName: 'EPD 01',
        status: Status.UNKNOWN,
        dataType: DataType.PRODUCT,
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
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Card style={{
                    width: '100%',
                    flex: 1,
                    marginTop: 5,
                    paddingBottom: 40
                }}
                    pb={16}
                    pt={16}
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

export default DataScreen;
;