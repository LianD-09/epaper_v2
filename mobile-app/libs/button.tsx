import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, DimensionValue, StyleProp, ViewStyle } from 'react-native';
import FontWeight from '../themes/font-weight';
import FontSize from '../themes/font-size';
import Color, { toOpacity } from '../themes/color';

type ButtonProps = {
    disable?: boolean,
    deleted?: boolean,
    secondary?: boolean,
    highlight?: boolean,
    height?: DimensionValue | undefined,
    width?: DimensionValue | undefined,
    transparent?: boolean,
    close?: boolean,
    onPress?: (...arg: any) => any,
    // direction,
    // data,
    startIcon?: React.ReactNode,
    fontSize?: number,
    success?: boolean,
    children?: React.ReactNode
    style?: StyleProp<ViewStyle>
    opacity?: number
}

const Button = ({
    disable,
    deleted,
    secondary,
    highlight,
    height = 46,
    width,
    transparent,
    close,
    onPress,
    // direction,
    // data,
    startIcon,
    fontSize,
    success,
    children,
    style,
    opacity = 1,
}: ButtonProps) => {
    const opacityApply = opacity < 0 || opacity > 1 ? 1 : opacity
    const [isPressed, setIsPressed] = useState(false);

    return (
        <View style={[styles.wrap, style]}>
            <TouchableOpacity
                style={[styles.container, { backgroundColor: toOpacity(opacityApply, Color.primary[700]) },
                disable && { backgroundColor: toOpacity(opacityApply, Color.disable[200]) },
                deleted && { backgroundColor: toOpacity(opacityApply, Color.error[400]) },
                secondary && { backgroundColor: toOpacity(opacityApply, Color.secondary[300]) },
                highlight && { backgroundColor: toOpacity(opacityApply, Color.info[500]) },
                success && { backgroundColor: toOpacity(opacityApply, Color.success[500]) },
                { height: height },
                { width: width },
                transparent && { backgroundColor: toOpacity(opacityApply, Color.white[100]), borderWidth: 0 },
                close && { backgroundColor: '#fff', borderWidth: 0, height: 7 }
                ]}
                disabled={disable ? true : false}
                onPress={async () => {
                    if (isPressed) return; // Prevent multiple presses
                    setIsPressed(true);
                    if (typeof onPress === "function") {
                        onPress();
                    } else {
                        // navigation.push(direction, data);
                    }
                    // After completing the operation, reset the press status
                    setTimeout(() => setIsPressed(false), 1000); // Allow a new press after 1 second
                }}
            >
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                    {startIcon && (
                        startIcon
                    )}
                    <Text style={[
                        styles.content,
                        { color: disable ? Color.disable[400] : Color.white[100] },
                        ,
                        deleted && {
                            color: Color.error[900],
                        },
                        secondary && {
                            color: Color.primary[500]
                        },
                        { fontSize: fontSize },
                        transparent && { color: Color.disable[600] }
                    ]}>
                        {children}
                    </Text>
                </View>
            </TouchableOpacity >
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    container: {
        width: '100%',
        borderRadius: 100,
        height: 64,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FontWeight.w700,
    },
    content: {
        textAlign: 'center',
        fontFamily: FontWeight.w700,
        fontSize: FontSize.Medium,
        lineHeight: 20,
        letterSpacing: 0.01,
    }
});

export default Button;
