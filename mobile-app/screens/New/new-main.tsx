/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../libs/button';
import Color from '../../themes/color';
import Header from '../../libs/header';
import Typography from '../../libs/typography';
import fontWeight from '../../themes/font-weight';
import fontSize from '../../themes/font-size';
import { StatusBar } from 'expo-status-bar';
import Card from '../../libs/card';
import NewItem from '../../components/new/new-item';
import { navigate, navigationRef } from '../../navigation/root-navigation';
import { NewDataScreenProps, NewDeviceScreenProps, RootStackNewParamList } from '../../navigation/param-types';


const NewMainScreen = ({ navigation, route }) => {
    const [select, setSelect] = useState<number>(1);

    const handleNext = () => {
        if (select == 1) {
            navigate<NewDeviceScreenProps, RootStackNewParamList>('NewDeviceScreen', {
                mode: 'bluetooth'
            })
        }
        if (select == 2) {
            navigate<NewDataScreenProps, RootStackNewParamList>('NewDataScreen')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
            // headerTitle='New device and data'
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.main}>
                    <View style={{ gap: 5 }}>
                        <Typography fontSize={fontSize.Gigantic} fontFamily={fontWeight.w700} textAlign='left' style={{ width: '50%' }}>
                            New
                        </Typography>
                        <Typography fontSize={fontSize.SuperTiny} fontFamily={fontWeight.w400} textAlign='left'>
                            Which one will you want to continue?
                        </Typography>
                    </View>
                    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            <TouchableOpacity activeOpacity={0.7} style={{ gap: 12, alignItems: 'center' }} onPress={() => setSelect(1)}>
                                <View style={{
                                    borderRadius: 999,
                                    borderWidth: 2,
                                    padding: 20,
                                    borderColor: select == 1 ? Color.primary[600] : Color.primary[200],
                                    aspectRatio: '1/1',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        source={require('assets/icons/ble-device-color.png')}
                                        style={{
                                            width: 76,
                                            height: 76
                                        }}
                                    />
                                </View>
                                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} color={select == 1 ? Color.primary[800] : Color.disable[400]}>
                                    New device
                                </Typography>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={{ gap: 12, alignItems: 'center' }} onPress={() => setSelect(2)}>
                                <View style={{
                                    borderRadius: 999,
                                    borderWidth: 2,
                                    padding: 20,
                                    borderColor: select == 2 ? Color.primary[600] : Color.primary[200],
                                    aspectRatio: '1/1',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        source={require('assets/icons/data-color.jpg')}
                                        style={{
                                            width: 53,
                                            height: 76,
                                        }}
                                        resizeMode='cover'
                                    />
                                </View>
                                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} color={select == 2 ? Color.primary[800] : Color.disable[400]}>
                                    New device
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Button onPress={handleNext}>Next</Button>
                </View>
            </ScrollView>
        </SafeAreaView>
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
        flex: 1,
        paddingHorizontal: 25,
        gap: 16,
        width: '100%'
    }
});

export default NewMainScreen;