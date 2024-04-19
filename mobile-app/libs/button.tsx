import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, DimensionValue } from 'react-native';
import FontWeight from '../themes/font-weight';
import FontSize from '../themes/font-size';
import Color from '../themes/color';

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
    children
}: ButtonProps) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <View >
            <TouchableOpacity
                style={[styles.container,
                disable && { backgroundColor: Color.disable[200] },
                deleted && { backgroundColor: Color.error[400] },
                secondary && { backgroundColor: Color.secondary[300] },
                highlight && { backgroundColor: Color.info[500] },
                success && { backgroundColor: Color.success[500] },
                { height: height },
                { width: width },
                transparent && { backgroundColor: Color.white[100], borderWidth: 0 },
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
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 100,
        height: 64,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FontWeight.w700,
        backgroundColor: Color.primary[700],
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
