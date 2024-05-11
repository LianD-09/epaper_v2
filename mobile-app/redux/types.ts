import { ImageSourcePropType } from "react-native";

export type BMState = {
    isOpen: boolean,
    isFailed: boolean,
    title: string,
    icon?: ImageSourcePropType | undefined,
    content?: React.ReactNode,
    btnTitle: string,
    btnCancelTitle: string,
    callback?: ((...args: any) => any) | null | undefined,
}
