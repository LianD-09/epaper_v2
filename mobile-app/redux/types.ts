import { ImageSourcePropType } from "react-native";
import { User } from "../types/type";

export type BMState = {
    isOpen: boolean,
    isFailed: boolean,
    title: string,
    icon?: ImageSourcePropType | undefined,
    content?: React.ReactNode,
    btnTitle: string,
    btnMores?: React.ReactNode[],
    btnCancelTitle: string,
    backgroundPressable?: boolean,
    callback?: ((...args: any) => any) | null | undefined,
}

export type SelectItem = {
    label: string,
    value: string | number | boolean,
    image?: ImageSourcePropType,
    iconBg?: string,
    type?: "mqtt" | "bluetooth"
}

export type SelectState = {
    isOpen: boolean,
    items: Array<SelectItem>,
    label: string,
    selectedItem: SelectItem | null,
    selected: SelectItem | null,
    mode?: string,
}

export type DatePickerState = {
    isOpen?: boolean,
    startDate: Date | null,
    endDate: Date | null,
    label: string,
    selectedDate?: Date | null,
    selected?: Date | null,
    mode: 'date' | 'time'
}

export type CMState = {
    isOpen: boolean,
    isFailed: boolean,
    title: string,
    icon?: ImageSourcePropType | undefined,
    content?: React.ReactNode,
    btnTitle: string,
    btnCancelTitle: string,
    backgroundPressable?: boolean,
    callback?: ((...args: any) => any) | null | undefined,
    callbackCancel?: ((...args: any) => any) | null | undefined,
}

export type UserState = {
    isLogin: boolean,
    data: User,
}