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
import { Device, } from '../../../types/type';
import TextField from '../../../libs/text-field';
import Button from '../../../libs/button';
import { useDispatch } from 'react-redux';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { replace } from '../../../navigation/root-navigation';
import iconHide from 'assets/icons/hide.png';
import iconShow from 'assets/icons/show.png';

const EditDevicesScreen = ({ navigation, route }) => {
    const { data, dataType } = route.params;
    const [name, setName] = useState<string>('');
    const [ssid, setSsid] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [hide, setHide] = useState<boolean>(true);
    const dispath = useDispatch();

    useEffect(() => {
        let item = data as Device;
        setName(item.name);
        setSsid(item.ssid);
        setPass(item.pass);
    }, []);

    const handlePress = () => {
        // call api
        replace('DevicesScreen');
    }

    useEffect(() => {

    }, [])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Device update'
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
                            onChange={setName}
                            disable={false}
                        />
                        <TextField
                            value={ssid}
                            placeholder={'Network SSID'}
                            label={'Network SSID'}
                            onChange={setSsid}
                            disable={false}
                        />
                        <TextField
                            value={pass}
                            keyboardType='default'
                            secure={hide}
                            placeholder={'Password'}
                            label={'Password'}
                            onChange={setPass}
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

export default EditDevicesScreen;