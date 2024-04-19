import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import Color from "../themes/color";
import { LegacyRef, forwardRef } from "react";
import React from "react";

type CardProps = {
    style?: StyleProp<ViewStyle>,
    onPress?: (...args: any) => any,
    children?: React.ReactNode,
    bgColor?: string,
    borderRadius?: number,
    borderColor?: string,
    disabled?: boolean,
    borderWidth?: number,
    pt?: number,
    pb?: number,
    pl?: number,
    pr?: number,
    gap?: number
}

const Card = forwardRef<View, CardProps>(({
    style = {},
    onPress,
    children,
    bgColor,
    borderRadius = 20,
    borderColor,
    disabled,
    borderWidth = 1,
    pt = 18,
    pb = 20,
    pl = 22,
    pr = 22,
    gap = 5
}, ref) => {
    return (
        <Pressable style={[
            styles.container, {
                backgroundColor: bgColor ? bgColor : Color.white[100],
                borderRadius: borderRadius,
                borderColor: borderColor ? borderColor : Color.disable[200],
                borderWidth: borderWidth,
                paddingTop: pt,
                paddingBottom: pb,
                paddingLeft: pl,
                paddingRight: pr,
                gap: gap
            },
            style
        ]}
            onPress={onPress}
            disabled={disabled}
            ref={ref}
        >
            {children}
        </Pressable>
    )
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
})

export default Card;