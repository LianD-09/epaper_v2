/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Card from '../../../libs/card';
import { StatusBar } from 'expo-status-bar';
import { Algorithms, DataType } from '../../../types/type';
import TextField from '../../../libs/text-field';
import SwitchCustom from '../../../libs/switch-custom';
import Typography from '../../../libs/typography';
import Button from '../../../libs/button';
import { useDispatch } from 'react-redux';
import { openDateTimePickerModal, resetDateTimePickerData } from '../../../redux/slice/date-picker-slice';
import DateTimeField from '../../../libs/date-time-field';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { navigate, pop } from '../../../navigation/root-navigation';
import { NewDataFillScreenProps, RootStackNewParamList, SubmitNewDataScreenProps } from '../../../navigation/param-types';
import { closeLoading, openLoading } from '../../../redux/slice/loading-slice';
import { createDataNoMqtt } from '../../../services/data-services';
import { capitalize, encodeValue } from '../../../utils/utils';
import { openBottomModal } from '../../../redux/slice/bottom-modal-slice';
import Select from '../../../libs/select';
import { SelectItem } from '../../../redux/types';
import { directions } from '../../../utils/constants';
import * as ImagePicker from 'expo-image-picker';
import { openCenterModal } from '../../../redux/slice/center-modal-slice';
import { ditheringGrayscale, getByteArray } from '../../../services/image-services';
import WebView from 'react-native-webview';

const directionItems: SelectItem[] = directions.map(e => ({
    label: capitalize(e),
    value: e
}));

const algorithmsItems: SelectItem[] = Object.entries(Algorithms)
    .filter(e => typeof e[1] === 'number')
    .map(e => ({
        value: e[1],
        label: `Style ${e[1]}`,
    }))

const NewDataFillScreen = ({ navigation, route }) => {
    const { dataType } = route.params as NewDataFillScreenProps;
    const [active, setActive] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [input2, setInput2] = useState<string>('');
    const [input3, setInput3] = useState<string>('');
    const [input4, setInput4] = useState<string>('');
    const [input5, setInput5] = useState<string>('');
    const [dateTime, setDateTime] = useState<Date>(new Date());
    const [direction, setDirection] = useState<SelectItem | null>(null);
    const [algorithm, setAlgorithm] = useState<SelectItem | null>(null);
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
    const [showImage, setShowImage] = useState<number[]>([]);
    const dispatch = useDispatch();

    const handlePickImage = async () => {
        if (!!!direction) {
            dispatch(openCenterModal({
                isOpen: true,
                isFailed: true,
                title: 'Notification',
                content: "You must choose direction to display first.",
                btnTitle: 'Close',
                btnCancelTitle: ''
            }));
            return;
        }
        dispatch(openLoading());
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                // aspect: direction?.value === 'vertical' ? [128, 296] : [296, 128],
                base64: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0]);
                const res = await getByteArray(result.assets[0].base64, direction?.value === 'horizontal');
                const format = ditheringGrayscale(res.pixels, algorithm?.value as Algorithms)
                setInput2(format.bitmap);
                setShowImage(format.pixels);
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            dispatch(closeLoading());
        }
    };

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
            case DataType.IMAGE:
                const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="display:flex;flex-direction:column;justify-content:center;align-items:center">
                        <div style="display:flex;align-items:center;justify-content:center;flex-direction:column;flex:1;">
                            <canvas id="canvas" width="128" height="296"></canvas>
                        </div>
                        <script>
                        const byteArray = ${JSON.stringify(showImage)};
                        const canvas = document.getElementById('canvas');
                        const ctx = canvas.getContext('2d');
                        const imageData = ctx.createImageData(128, 296);
                        for (let i = 0; i < byteArray.length; i++) {
                            const value = byteArray[i];
                            const idx = i * 4;
                            imageData.data[idx] = value;
                            imageData.data[idx + 1] = value;
                            imageData.data[idx + 2] = value;
                            imageData.data[idx + 3] = 255;
                        }
                        ctx.putImageData(imageData, 0, 0);
                        const dataUrl = canvas.toDataURL();
                        window.ReactNativeWebView.postMessage(dataUrl);
                        </script>
                    </body>
                    </html>
                `;
                return (
                    <>
                        <Select
                            items={directionItems}
                            value={direction}
                            onSelect={(value) => {
                                if (value.value != direction?.value) {
                                    setDirection(value);
                                    setImage(undefined);
                                    setInput3(value.value as string);
                                }
                            }}
                            placeholder='Choose direction'
                            label={'Direction'}
                        />
                        <Select
                            items={algorithmsItems}
                            value={algorithm}
                            onSelect={(value) => {
                                handleChangeAlgorithm(value);
                            }}
                            placeholder='Choose style'
                            label={'Style'}
                        />
                        <Button highlight onPress={handlePickImage}>Select image</Button>
                        {
                            !!image && <View style={{ gap: 4 }}>
                                <View style={styles.buttonCustomViewLabel}>
                                    <Text style={styles.label}>Preview</Text>
                                </View>
                                <Card
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transform: [{
                                            rotate: direction?.value === 'horizontal' ? '-90deg' : '0deg'
                                        }]
                                    }}
                                >
                                    {/* <Image
                                    source={{ uri: image.uri }}
                                    style={{ width: 128, height: 296, marginVertical: 10 }}
                                /> */}
                                    <WebView
                                        originWhitelist={['*']}
                                        source={{ html: htmlContent }}
                                        style={[styles.webview, {
                                            width: 128 + 20,
                                            height: 296 + 20,
                                        }]}
                                        javaScriptEnabled={true}
                                    />
                                </Card >
                            </View>
                        }

                    </>
                )
        }
    }

    const handleChangeAlgorithm = async (value) => {
        setAlgorithm(value);

        try {
            if (!!image) {
                const res = await getByteArray(image?.base64, direction?.value === 'horizontal');
                const format = ditheringGrayscale(res.pixels, value.value as Algorithms)
                setInput2(format.bitmap);
                setShowImage(format.pixels);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    const handlePress = async () => {
        if (active) {
            navigate<SubmitNewDataScreenProps, RootStackNewParamList>('SubmitNewDataScreen', {
                data: {
                    name: dataType === DataType.IMAGE ? 'IMAGE' : name,
                    input2,
                    input3,
                    input4,
                    input5,
                },
                dataType: dataType
            })
        }
        else try {
            dispatch(openLoading());

            await createDataNoMqtt({
                name: dataType === DataType.IMAGE ? 'IMAGE' : name,
                input2,
                input3,
                input4,
                active,
                type: capitalize(dataType),
                activeStartTime: -1,
                deviceID: '',
                deviceName: '',
                activeTimestamp: [],
                fontStyle: '',
                designSchema: ''
            });
            dispatch(openBottomModal({
                isOpen: true,
                isFailed: false,
                title: 'Successful',
                content: 'This data has been created.',
                btnTitle: 'Close',
                callback: () => pop(),
                btnCancelTitle: ''
            }))
        }
        catch (e) {
            console.log(e);
            dispatch(openBottomModal({
                isOpen: true,
                isFailed: true,
                title: 'Failed',
                content: 'Something was wrong. Please try again.',
                btnTitle: 'Close',
                btnCancelTitle: ''
            }))
        }
        finally {
            dispatch(closeLoading());
        }
    }

    useEffect(() => {
        dispatch(resetDateTimePickerData());
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
    },
    webview: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonCustomViewLabel: {
        flexDirection: "column",
        width: "100%",
    },
    label: {
        paddingHorizontal: 16,
        fontSize: fontSize.Tiny,
        fontFamily: fontWeight.w700,
        color: Color.primary[400],
    },
});

export default NewDataFillScreen;