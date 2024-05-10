import React from 'react';
import { View, StyleSheet, Text, StyleProp, TextStyle, ColorValue } from 'react-native';
import Color from '../themes/color';
import FontSize from '../themes/font-size';
import FontWeight from '../themes/font-weight';

type TypographyProps = {
    style?: StyleProp<TextStyle>,
    numberOfLines?: number,
    color?: ColorValue,
    fontFamily?: string,
    fontSize?: number | undefined,
    textAlign?: "auto" | "center" | "left" | "right" | "justify" | undefined,
    letterSpacing?: number | undefined,
    lineHeight?: number | undefined,
    children?: React.ReactNode,
    styleText?: StyleProp<TextStyle>
}

const Typography = ({
    style,
    numberOfLines,
    color,
    fontFamily,
    fontSize,
    textAlign,
    letterSpacing,
    lineHeight,
    children,
    styleText
}: TypographyProps) => {
    return (
        <View style={[styles.container, style]}>
            <Text numberOfLines={numberOfLines} style={[
                styles.titleStyle,
                {
                    color: color ? color : Color.primary[700],
                    fontFamily: fontFamily ? fontFamily : FontWeight.w500,
                    fontSize: fontSize ? fontSize : FontSize.Normal,
                    textAlign: textAlign ? textAlign : 'center',
                    letterSpacing: letterSpacing ? letterSpacing : 0.01,
                    lineHeight: lineHeight ? lineHeight : (fontSize ?? 17) * 1.2,
                }, styleText
            ]}>
                {children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    titleStyle: {
        fontStyle: 'normal',
        flexShrink: 1
    },
});

export default Typography;