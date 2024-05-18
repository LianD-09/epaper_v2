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
import { DataRaw, DataType, Template } from '../../../types/type';
import Button from '../../../libs/button';
import Select from '../../../libs/select';
import { fonts, themes } from '../../../utils/constants';
import { SelectItem } from '../../../redux/types';
import { replace } from '../../../navigation/root-navigation';

const fontList: Array<SelectItem> = fonts.map(e => {
    return {
        label: e,
        value: e,
    }
})
const themeList: Array<SelectItem> = themes.map(e => {
    return {
        label: e,
        value: e,
    }
})

const deviceMock: Array<SelectItem> = Array(5).fill(1).map((e, index) => {
    return {
        label: `Device-${index}`,
        value: index,
    }
})

const SubmitEditDataScreen = ({ navigation, route }) => {
    const { data, dataType } = route.params;
    const [device, setDevice] = useState<string | number | null>(null);
    const [font, setFont] = useState<string>('');
    const [theme, setTheme] = useState<string>('');

    useEffect(() => {
        let item: DataRaw = data as DataRaw;

        setDevice(item.deviceID);
        setFont(item.fontStyle);
        setTheme(item.designSchema);

        switch (dataType) {
            case DataType.PRODUCT:
                break;
            case DataType.CLIENT:
                break;
            case DataType.EMPLOYEE:
                break;
            case DataType.ROOM:
                break;
            case DataType.STUDENT:
                break;
        }
    }, []);

    const handleSubmit = async () => {
        // call api
        replace('DataScreen');
    }

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
                        <Select
                            value={device}
                            placeholder={'Select a device'}
                            label={'Device'}
                            items={deviceMock}
                            onSelect={setDevice} />
                        <Select
                            value={font}
                            placeholder={'Select a font'}
                            label={'Font'}
                            items={fontList}
                            onSelect={setFont} />
                        <Select
                            value={theme}
                            placeholder={'Theme'}
                            label={'Theme'}
                            items={themeList}
                            onSelect={setTheme} />
                    </View>
                    <Button
                        onPress={handleSubmit}
                        disable={!device && !font && !theme}
                    >
                        Submit
                    </Button>
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

export default SubmitEditDataScreen;