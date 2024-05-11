import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Client, DataType, Employee, Product, Room, Student } from '../types/type';

export type EditDataScreenProps = {
    data?: Product | Student | Employee | Room | Client;
    dataType?: DataType;
}

export type RootStackHomeParamList = {
    EditDataScreen: EditDataScreenProps;
    HomeScreen: undefined;
    DataScreen: undefined;
    DevicesScreen: undefined;
};