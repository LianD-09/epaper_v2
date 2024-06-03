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
import { navigate, pop } from '../../../navigation/root-navigation';
import { EditDataScreenProps, RootStackHomeParamList, SubmitEditDataScreenProps } from '../../../navigation/param-types';
import { deleteData, updateData } from '../../../services/data-services';
import { capitalize } from '../../../utils/utils';
import { closeLoading, openLoading } from '../../../redux/slice/loading-slice';
import { openBottomModal } from '../../../redux/slice/bottom-modal-slice';
import { openCenterModal } from '../../../redux/slice/center-modal-slice';

const EditDataScreen = ({ navigation, route }) => {
    const { data, dataType } = route.params as EditDataScreenProps;
    const [active, setActive] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [input2, setInput2] = useState<string>('');
    const [input3, setInput3] = useState<string>('');
    const [input4, setInput4] = useState<string>('');
    const [dateTime, setDateTime] = useState<Date>(new Date());
    const dispath = useDispatch();

    useEffect(() => {
        let item: Template = data as Template;
        setActive(item.active);

        switch (dataType) {
            case DataType.PRODUCT:
                item = data as Product;
                setName(item.name);
                setInput2(item.category);
                setInput3(item.price);
                break;
            case DataType.CLIENT:
                item = data as Client;
                setName(item.name);
                setInput2(item.email);
                setInput3(item.address);
                break;
            case DataType.EMPLOYEE:
                item = data as Employee;
                setName(item.name);
                setInput2(item.email);
                setInput3(item.employeeId);
                setInput4(item.department);
                break;
            case DataType.ROOM:
                item = data as Room;
                setName(item.name);
                setInput2(item.purpose);
                setInput3(item.manager);
                setInput4(item.roomStatus);
                break;
            case DataType.STUDENT:
                item = data as Student;
                setName(item.name);
                setInput2(item.email);
                setInput3(item.studentId);
                setInput4(item.class);
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

    const handlePress = async () => {
        if (active) {
            navigate<SubmitEditDataScreenProps, RootStackHomeParamList>('SubmitEditDataScreen', {
                data: {
                    ...data,
                    _id: data?.id,
                    name,
                    input2,
                    input3,
                    input4,
                    active,
                    type: capitalize(dataType),
                },
                dataType: dataType
            })
        }
        else {
            // call api
            try {
                dispath(openLoading());
                await updateData(data?.id, {
                    ...data,
                    name,
                    input2,
                    input3,
                    input4,
                    active,
                    type: capitalize(dataType),
                });
                dispath(openBottomModal({
                    isOpen: true,
                    isFailed: false,
                    title: 'Successful',
                    content: 'This data has been updated.',
                    btnTitle: 'Close',
                    callback: () => pop(),
                    btnCancelTitle: ''
                }))
            }
            catch (e) {
                console.log(e);
                dispath(openBottomModal({
                    isOpen: true,
                    isFailed: true,
                    title: 'Failed',
                    content: 'Something was wrong. Please try again.',
                    btnTitle: 'Close',
                    btnCancelTitle: ''
                }))
            }
            finally {
                dispath(closeLoading());
            }
        }
    }
    const handleDelete = () => {
        // call api
        dispath(openCenterModal({
            isOpen: true,
            isFailed: false,
            title: 'Warning',
            content: 'Are you sure you want to delete this data?',
            btnTitle: 'Yes',
            callback: async () => {
                try {
                    dispath(openLoading());
                    await deleteData((data as Template).id);

                    dispath(openBottomModal({
                        isOpen: true,
                        isFailed: false,
                        title: 'Successful',
                        content: 'This data has been removed.',
                        btnTitle: 'Close',
                        callback: () => pop(),
                        btnCancelTitle: ''
                    }))
                }
                catch (e) {
                    console.log(e);
                    dispath(openBottomModal({
                        isOpen: true,
                        isFailed: true,
                        title: 'Failed',
                        content: 'Something was wrong. Please try again.',
                        btnTitle: 'Close',
                        btnCancelTitle: ''
                    }))
                }
                finally {
                    dispath(closeLoading());
                }
            },
            btnCancelTitle: 'Cancel',
        }))
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
                    <View style={{ width: '100%', gap: 4 }}>
                        <Button onPress={handlePress}>{active ? 'Continue' : 'Submit'}</Button>
                        <Button onPress={handleDelete} deleted>{'Delete'}</Button>
                    </View>
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