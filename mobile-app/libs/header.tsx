import { GestureResponderEvent, Image, ImageSourcePropType, Pressable, StyleProp, StyleSheet, Touchable, TouchableOpacity, View, ViewStyle } from "react-native"
import Color from "../themes/color";
import { LegacyRef, forwardRef } from "react";
import React from "react";
import Typography from "./typography";
import fontWeight from "../themes/font-weight";
import fontSize from "../themes/font-size";
import { navigationRef } from "../navigation/root-navigation";

type HeaderProps = {
    style?: StyleProp<ViewStyle>,
    onPressLeft?: (...args: any) => any,
    onPressRight?: (...args: any) => any,
    headerTitle?: React.ReactNode,
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
    iconLeft = <Image source={require('assets/icons/back-48px.png')} style={{ width: 32, height: 32 }} tintColor={Color.primary[700]} />,
    iconRight,
    bgColor = Color.white[100],
    borderRadius = 20,
    borderColor = 'transparent',
    disabled,
    borderWidth = 0,
}, ref) => {
    const handleLeftPress = (event: GestureResponderEvent) => {
        if (onPressLeft) {
            onPressLeft(event);
        }
        else {
            navigationRef.goBack();
        }
    }
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
                <View style={[styles.items, { alignItems: 'flex-start' }]}>
                    <TouchableOpacity onPress={handleLeftPress}>
                        {
                            displayIconLeft && iconLeft

                        }
                    </TouchableOpacity>
                </View>
                <View style={[styles.items, { flexGrow: 8 }]}>
                    {
                        typeof headerTitle === 'string' ?
                            <Typography fontFamily={fontWeight.w700} fontSize={fontSize.VeryBig} lineHeight={26}>
                                {headerTitle}
                            </Typography>
                            :
                            headerTitle
                    }
                </View>
                <View style={[styles.items, { alignItems: 'flex-end' }]}>
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
        marginVertical: 5,
        paddingTop: 20,
    },
    wrap: {
        width: '100%',
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    items: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Header;