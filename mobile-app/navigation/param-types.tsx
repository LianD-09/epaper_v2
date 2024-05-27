import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Client, DataRaw, DataType, Device, Employee, Product, Room, Student } from '../types/type';
import * as BLE from "react-native-ble-plx";

export type RootStack = {}

export type EditDataScreenProps = {
    data?: Product | Student | Employee | Room | Client;
    dataType?: DataType;
}
export type SubmitEditDataScreenProps = {
    data?: DataRaw;
    dataType?: DataType;
}

export type EditDevicesScreenProps = {
    data?: Device;
}

export type RootStackHomeParamList = RootStack & {
    EditDataScreen: EditDataScreenProps;
    HomeScreen: undefined;
    DataScreen: undefined;
    DevicesScreen: undefined;
    SubmitEditDataScreen: SubmitEditDataScreenProps;
    EditDevicesScreen: SubmitEditDataScreenProps;
    ProfileScreen: undefined;
};

export type NewDeviceScreenProps = {
    mode: 'bluetooth' | 'adhoc';
}

export type NewDataScreenProps = {
}

export type NewDeviceFillScreenProps = {
}

export type NewDataFillScreenProps = {
    dataType: DataType
}

export type SubmitNewDataScreenProps = {
    data: {
        name: string,
        input2?: string | undefined,
        input3?: string | undefined,
        input4?: string | undefined,
        input5?: string | undefined,
    };
    dataType: DataType;
}

export type RootStackNewParamList = RootStack & {
    NewMainScreen: undefined;
    NewDeviceScreen: NewDeviceScreenProps;
    NewDeviceFillScreen: NewDeviceFillScreenProps;
    NewDataScreen: NewDeviceScreenProps;
    NewDataFillScreen: NewDataFillScreenProps;
    SubmitNewDataScreen: SubmitNewDataScreenProps;
};