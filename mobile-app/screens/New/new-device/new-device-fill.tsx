/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Card from '../../../libs/card';
import { StatusBar } from 'expo-status-bar';
import { DataType, Device, DeviceRaw, } from '../../../types/type';
import TextField from '../../../libs/text-field';
import Button from '../../../libs/button';
import { useDispatch } from 'react-redux';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { navigate, navigateThroughStack, navigationRef, replace } from '../../../navigation/root-navigation';
import iconHide from 'assets/icons/hide.png';
import iconShow from 'assets/icons/show.png';
import useBLE from '../../../hooks/useBLE';
import { wifiServiceAndCharacteristic } from '../../../utils/constants';
import { NewDataScreenProps, RootStackNewParamList } from '../../../navigation/param-types';
import { openCenterModal } from '../../../redux/slice/center-modal-slice';
import Typography from '../../../libs/typography';
import { closeLoading, openLoading } from '../../../redux/slice/loading-slice';
import { createDevice } from '../../../services/device-services';
import { validateName, validateSSID, validateWifiPass } from '../../../utils/regex';
import { openBottomModal } from '../../../redux/slice/bottom-modal-slice';
import { AxiosError } from 'axios';

const NewDeviceFillScreen = ({ navigation, route }) => {
    const [name, setName] = useState<string>('');
    const [ssid, setSsid] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [nameError, setNameError] = useState<boolean>(false);
    const [ssidError, setSsidError] = useState<boolean>(false);
    const [passError, setPassError] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(true);
    const dispath = useDispatch();
    const { changeCharacteristicsValue, changeWifiConfiguration, connectedDevice, disconnectFromDevice, uniqueId } = useBLE();

    const handlePress = async () => {
        const nameErr = !validateName(name);
        const ssidErr = !validateSSID(ssid);
        const passErr = !validateWifiPass(pass);
        if (nameErr || ssidErr || passErr) {
            setNameError(nameErr);
            setSsidError(ssidErr);
            setPassError(passErr);
            return;
        }

        try {
            dispath(openLoading());
            // call api
            const res = await createDevice({
                uniqueID: uniqueId,
                name: name,
                pass: pass,
                ssid: ssid,
            });
            console.log(res.data);


            const newDevice = res.data.data as DeviceRaw;

            await changeWifiConfiguration(ssid, pass, newDevice._id);
            dispath(openCenterModal({
                isOpen: true,
                isFailed: false,
                title: `${res.data.status === 1 ? 'Create' : 'Update'} device successfully`,
                btnTitle: 'Add data',
                btnCancelTitle: 'Reset device',
                icon: require('assets/icons/success-color.png'),
                content: `Device has been ${res.data.status === 1 ? 'created' : 'updated'}. Do you want to create or update data?`,
                callback: () => replace<NewDataScreenProps, RootStackNewParamList>('NewDataScreen'),
                callbackCancel: async () => {
                    // await changeCharacteristicsValue(
                    //     wifiServiceAndCharacteristic.uuid,
                    //     wifiServiceAndCharacteristic.characteristics.restart,
                    //     "1",
                    //     false
                    // );
                    // navigationRef.reset({
                    //     index: 0,
                    //     routes: [{
                    //         name: 'Home',
                    //         params: {
                    //             screen: "HomeScreen"
                    //         }
                    //     }]
                    // })
                },
                // backgroundPressable: false,
            }))
        }
        catch (e) {
            console.log(e);
            dispath(openBottomModal({
                isOpen: true,
                isFailed: true,
                title: 'Create new device failed',
                content: (e as AxiosError).message,
                btnTitle: 'Close',
                btnCancelTitle: ''
            }))
        }
        finally {
            dispath(closeLoading());
        }
    }

    useEffect(() => {
        return () => {
            disconnectFromDevice();
        }
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='New device'
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
                        <TextField
                            value={name}
                            placeholder={'Device name'}
                            label={'Device name'}
                            error={nameError}
                            helperText={'This field cannot be empty and contain alphabet characters, ".", "-" only'}
                            onFocus={() => setNameError(false)}
                            onChange={setName}
                            disable={false}
                        />
                        <TextField
                            value={ssid}
                            placeholder={'Network SSID'}
                            label={'Network SSID'}
                            error={ssidError}
                            helperText={'This field cannot be empty'}
                            onFocus={() => setSsidError(false)}
                            onChange={setSsid}
                            disable={false}
                        />
                        <TextField
                            value={pass}
                            keyboardType='default'
                            secure={hide}
                            placeholder={'Password'}
                            label={'Password'}
                            error={passError}
                            helperText={'This field cannot be empty and contain at least 8 characters'}
                            onChange={setPass}
                            onFocus={() => setPassError(false)}
                            disable={false}
                            labelIcon={
                                <Pressable
                                    style={{ alignItems: 'flex-end', justifyContent: 'center', paddingRight: 4 }}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setHide(!hide)
                                    }}>
                                    <Image
                                        source={hide ? iconHide : iconShow}
                                        style={{ width: 16, height: 16 }}
                                        tintColor={Color.primary[700]}
                                    />
                                </Pressable>
                            }
                        />
                    </View>
                    <Button onPress={handlePress}>{'Submit'}</Button>
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

export default NewDeviceFillScreen;