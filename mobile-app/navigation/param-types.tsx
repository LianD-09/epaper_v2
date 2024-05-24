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
};

export type NewDeviceScreenProps = {
    mode: 'bluetooth' | 'adhoc';
}

export type NewDataScreenProps = {
    dataType: DataType;
}

export type NewDeviceFillScreenProps = {
}

export type RootStackNewParamList = RootStack & {
    NewMainScreen: undefined;
    NewDeviceScreen: NewDeviceScreenProps;
    NewDeviceFillScreen: NewDeviceFillScreenProps;
    NewDataScreen: NewDeviceScreenProps;
};