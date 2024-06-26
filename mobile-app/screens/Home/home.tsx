/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Button from '../../libs/button';
import Color from '../../themes/color';
import Header from '../../libs/header';
import Typography from '../../libs/typography';
import fontWeight from '../../themes/font-weight';
import fontSize from '../../themes/font-size';
import HomeCard, { TitleEnum } from '../../components/home/home-card';
import FeaturesCard from '../../components/home/features-card';
import { StatusBar } from 'expo-status-bar';
import { navigate } from '../../navigation/root-navigation';
import { getToken } from '../../services/storage-services';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../../redux/types';
import { RootState } from '../../redux/store';
import { DataRaw, DeviceRaw } from '../../types/type';
import { getAllDevices } from '../../services/device-services';
import { getAllData } from '../../services/data-services';
import { openCenterModal } from '../../redux/slice/center-modal-slice';
import { AxiosError } from 'axios';
import { useFocusEffect } from '@react-navigation/native';


const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userState = useSelector<RootState, UserState>(state => state.user);
    const [devices, setDevices] = useState<Array<DeviceRaw>>([]);
    const [data, setData] = useState<Array<DataRaw>>([]);

    const getDevicesAndData = async () => {
        try {
            const allDevices = await getAllDevices();
            const allData = await getAllData();

            setData(allData.data.data);
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
    }

    useFocusEffect(
        React.useCallback(() => {
            getDevicesAndData();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Header
                    iconLeft={
                        <Image source={require('assets/icons/action-48px.png')} style={{ width: 28, height: 28 }} tintColor={Color.primary[700]} />
                    }
                    iconRight={
                        <Image source={require('assets/icons/profile-48px.png')} style={{ width: 32, height: 32 }} tintColor={Color.primary[700]} />
                    }
                    onPressRight={() => navigate('ProfileScreen')}
                    onPressLeft={() => navigate('AboutScreen')}
                />
                <View style={{ paddingHorizontal: 25, gap: 24, }}>
                    <View style={styles.main}>
                        <Typography color={Color.primary[700]} fontFamily={fontWeight.w500} fontSize={fontSize.Small} textAlign='left'>
                            Welcome,
                        </Typography>
                        <Typography color={Color.primary[700]} fontFamily={fontWeight.w800} fontSize={fontSize.Gigantic} textAlign='left'>
                            {userState.data.name}
                        </Typography>
                    </View>
                    <FeaturesCard />
                    <HomeCard title={TitleEnum.devices} navigation={navigation} data={devices} />
                    <HomeCard title={TitleEnum.data} navigation={navigation} data={data} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white[100],
    },
    content: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        paddingBottom: 40
    },
    main: {
        gap: 5,
        width: '100%',
        marginBottom: 5
    }
});

export default HomeScreen;