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
import { Client, DataType, Employee, Product, Room, Status, Student, Template } from '../../../types/type';
import TextField from '../../../libs/text-field';
import SwitchCustom from '../../../libs/switch-custom';
import Typography from '../../../libs/typography';
import Button from '../../../libs/button';
import Select from '../../../libs/select';
import { useDispatch } from 'react-redux';
import { openDateTimePickerModal, resetDateTimePickerData } from '../../../redux/slice/date-picker-slice';
import DateTimeField from '../../../libs/date-time-field';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { navigate } from '../../../navigation/root-navigation';
import { SubmitEditDataScreenProps } from '../../../navigation/param-types';

const EditDataScreen = ({ navigation, route }) => {
    const { data, dataType } = route.params;
    const [active, setActive] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [input2, setInput2] = useState<string>('');
    const [input3, setInput3] = useState<string>('');
    const [input4, setInput4] = useState<string>('');
    const [dateTime, setDateTime] = useState<Date>(new Date());
    const dispath = useDispatch();

    useEffect(() => {
        let item: Template = data as Template;
        setActive(item.active);
        setName(item.name);

        switch (dataType) {
            case DataType.PRODUCT:
                item = data as Product;
                setInput2(item.category);
                setInput3(item.price);
                break;
            case DataType.CLIENT:
                item = data as Client;
                setEmail(item.email);
                setInput2(item.address);
                break;
            case DataType.EMPLOYEE:
                item = data as Employee;
                setEmail(item.email);
                setInput2(item.employeeId);
                setInput3(item.department);
                break;
            case DataType.ROOM:
                item = data as Room;
                setEmail(item.email);
                setInput2(item.purpose);
                setInput3(item.manager);
                setInput4(item.roomStatus);
                break;
            case DataType.STUDENT:
                item = data as Student;
                setEmail(item.email);
                setInput2(item.studentId);
                setInput3(item.class);
                break;
        }
    }, []);

    const renderByType = () => {
        let item: Template;
        switch (dataType) {
            case DataType.PRODUCT:
                item = data as Product;
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
                item = data as Client;
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
                            value={email}
                            keyboardType='email-address'
                            placeholder={'Email'}
                            label={'Email'}
                            onChange={setEmail}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            placeholder={'Address'}
                            label={'Address'}
                            onChange={setInput2}
                            disable={false}
                        />
                    </>
                );
            case DataType.EMPLOYEE:
                item = data as Employee;
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
                            value={email}
                            keyboardType='email-address'
                            placeholder={'Email'}
                            label={'Email'}
                            onChange={setEmail}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            placeholder={'Employee ID'}
                            label={'Employee ID'}
                            onChange={setInput2}
                            disable={false}
                        />
                        <TextField
                            value={input3}
                            placeholder={'Department'}
                            label={'Department'}
                            onChange={setInput3}
                            disable={false}
                        />
                    </>
                );
            case DataType.ROOM:
                item = data as Room;
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
                            value={email}
                            keyboardType='email-address'
                            placeholder={'Email'}
                            label={'Email'}
                            onChange={setEmail}
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
                item = data as Student;
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
                            value={email}
                            keyboardType='email-address'
                            placeholder={'Email'}
                            label={'Email'}
                            onChange={setEmail}
                            disable={false}
                        />
                        <TextField
                            value={input2}
                            placeholder={'Student ID'}
                            label={'Student ID'}
                            onChange={setInput2}
                            disable={false}
                        />
                        <TextField
                            value={input3}
                            placeholder={'Class'}
                            label={'Class'}
                            onChange={setInput3}
                            disable={false}
                        />
                    </>
                );
        }
    }

    const handlePress = () => {
        if (active) {
            navigate<SubmitEditDataScreenProps>('SubmitEditDataScreen', {
                data: {
                    ...data,
                    name,
                    email,
                    input2,
                    input3,
                    input4,
                },
                dataType: dataType
            })
        }
        else {
            // call api
        }
    }

    useEffect(() => {
        dispath(resetDateTimePickerData());
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Data update'
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

export default EditDataScreen;