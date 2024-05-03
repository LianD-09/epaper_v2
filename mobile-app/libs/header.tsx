import { Image, ImageSourcePropType, Pressable, StyleProp, StyleSheet, Touchable, TouchableOpacity, View, ViewStyle } from "react-native"
import Color from "../themes/color";
import { LegacyRef, forwardRef } from "react";
import React from "react";
import Typography from "./typography";

type HeaderProps = {
    style?: StyleProp<ViewStyle>,
    onPressLeft?: (...args: any) => any,
    onPressRight?: (...args: any) => any,
    headerTitle: React.ReactNode,
    displayIconLeft?: boolean,
    displayIconRight?: boolean,
    iconLeft?: React.ReactNode,
    iconRight?: React.ReactNode,
    bgColor?: string,
    borderRadius?: number,
    borderColor?: string,
    disabled?: boolean,
    borderWidth?: number,
}

const Header = forwardRef<View, HeaderProps>(({
    style = {},
    onPressLeft,
    onPressRight,
    headerTitle,
    displayIconLeft = true,
    displayIconRight = true,
    iconLeft = <Image source={require('assets/icons/back-24px.png')} style={{ width: 24, height: 24 }} />,
    iconRight,
    bgColor,
    borderRadius = 20,
    borderColor = 'transparent',
    disabled,
    borderWidth = 0,
}, ref) => {
    return (
        <View style={styles.container}>
            <View style={
                [
                    styles.wrap,
                    {
                        backgroundColor: bgColor,
                        borderBottomLeftRadius: borderRadius,
                        borderBottomRightRadius: borderRadius,
                        borderColor: borderColor,
                        borderWidth: borderWidth
                    },
                    style
                ]
            }
            >
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={onPressLeft}>
                        {
                            displayIconLeft && iconLeft

                        }
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        typeof headerTitle === 'string' ?
                            <Typography >{headerTitle}</Typography> :
                            headerTitle
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={onPressRight}>
                        {
                            displayIconRight && iconRight

                        }
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 0,
    },
    wrap: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    }
})

export default Header;