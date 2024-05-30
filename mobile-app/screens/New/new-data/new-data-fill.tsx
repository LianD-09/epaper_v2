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
import { DataType } from '../../../types/type';
import TextField from '../../../libs/text-field';
import SwitchCustom from '../../../libs/switch-custom';
import Typography from '../../../libs/typography';
import Button from '../../../libs/button';
import { useDispatch } from 'react-redux';
import { openDateTimePickerModal, resetDateTimePickerData } from '../../../redux/slice/date-picker-slice';
import DateTimeField from '../../../libs/date-time-field';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { navigate } from '../../../navigation/root-navigation';
import { RootStackNewParamList, SubmitNewDataScreenProps } from '../../../navigation/param-types';
import { openLoading } from '../../../redux/slice/loading-slice';

const NewDataFillScreen = ({ navigation, route }) => {
    const { dataType } = route.params;
    const [active, setActive] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [input2, setInput2] = useState<string>('');
    const [input3, setInput3] = useState<string>('');
    const [input4, setInput4] = useState<string>('');
    const [input5, setInput5] = useState<string>('');
    const [dateTime, setDateTime] = useState<Date>(new Date());
    const dispath = useDispatch();

    const renderByType = () => {
        switch (dataType) {
            case DataType.PRODUCT:
                return (
                    <>
                        <TextField
                            value={name}
                            placeholder={'Name'}
                            label={'Name'}
                            onChange={setName}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            placeholder={'Category'}
                            label={'Category'}
                            onChange={setInput2}
                            disable={false}
                        />
                        <TextField
                            value={input3}
                            placeholder={'Price'}
                            label={'Price'}
                            onChange={setInput3}
                            disable={false}
                        />
                    </>
                );
            case DataType.CLIENT:
                return (
                    <>
                        <TextField
                            value={name}
                            placeholder={'Name'}
                            label={'Name'}
                            onChange={setName}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            keyboardType='email-address'
                            placeholder={'Email'}
                            label={'Email'}
                            onChange={setInput2}
                            disable={false}
                        />
                        <TextField
                            value={input3}
                            placeholder={'Address'}
                            label={'Address'}
                            onChange={setInput3}
                            disable={false}
                        />
                    </>
                );
            case DataType.EMPLOYEE:
                return (
                    <>
                        <TextField
                            value={name}
                            placeholder={'Name'}
                            label={'Name'}
                            onChange={setName}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            keyboardType='email-address'
                            placeholder={'Email'}
                            label={'Email'}
                            onChange={setInput2}
                            disable={false}
                        />
                        <TextField
                            value={input3}
                            placeholder={'Employee ID'}
                            label={'Employee ID'}
                            onChange={setInput3}
                            disable={false}
                        />
                        <TextField
                            value={input4}
                            placeholder={'Department'}
                            label={'Department'}
                            onChange={setInput4}
                            disable={false}
                        />
                    </>
                );
            case DataType.ROOM:
                return (
                    <>
                        <TextField
                            value={name}
                            placeholder={'Name'}
                            label={'Name'}
                            onChange={setName}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            placeholder={'Purpose'}
                            label={'Purpose'}
                            onChange={setInput2}
                            disable={false}
                        />
                        <TextField
                            value={input3}
                            placeholder={'Manager'}
                            label={'Manager'}
                            onChange={setInput3}
                            disable={false}
                        />
                        <TextField
                            value={input4}
                            placeholder={'Status'}
                            label={'Status'}
                            onChange={setInput4}
                            disable={false}
                        />
                    </>
                );
            case DataType.STUDENT:
                return (
                    <>
                        <TextField
                            value={name}
                            placeholder={'Name'}
                            label={'Name'}
                            onChange={setName}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            keyboardType='email-address'
                            placeholder={'Email'}
                            label={'Email'}
                            onChange={setInput2}
                            disable={false}
                        />
                        <TextField
                            value={input3}
                            placeholder={'Student ID'}
                            label={'Student ID'}
                            onChange={setInput3}
                            disable={false}
                        />
                        <TextField
                            value={input4}
                            placeholder={'Class'}
                            label={'Class'}
                            onChange={setInput4}
                            disable={false}
                        />
                    </>
                );
        }
    }

    const handlePress = () => {
        if (active) {
            navigate<SubmitNewDataScreenProps, RootStackNewParamList>('SubmitNewDataScreen', {
                data: {
                    name,
                    input2,
                    input3,
                    input4,
                    input5,
                },
                dataType: dataType
            })
        }
        else {
            // call api
            // dispath(openLoading());
        }
    }

    useEffect(() => {
        dispath(resetDateTimePickerData());
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Data information'
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
                        {renderByType()}
                        <SwitchCustom isOn={active} onToggle={() => setActive(!active)} label={'Display on EPD?'} />
                        {active && <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <DateTimeField
                                onSelect={(value) => {
                                    setDateTime(value);
                                }}
                                value={dateTime}
                                label={''}
                                mode='date'
                            />
                            <Typography fontFamily={fontWeight.w700} fontSize={fontSize.Medium}>at</Typography>
                            <DateTimeField
                                onSelect={(value) => {
                                    setDateTime(value);
                                }}
                                value={dateTime}
                                label={''}
                                mode='time'
                            />
                        </View>
                        }
                    </View>
                    <Button onPress={handlePress}>{active ? 'Continue' : 'Submit'}</Button>
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

export default NewDataFillScreen;