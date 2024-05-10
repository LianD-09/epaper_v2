import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Color from "../themes/color";

type DividerProps = {
    bdWidth?: number,
    bdStyle?: string,
    color?: string,
    width?: ViewStyle['width']
}

const Divider = ({ bdWidth = 1.5, color, bdStyle, width = '100%' }: DividerProps) => {

    return (
        <View style={[styles.container, bdWidth ? {
            height: bdWidth,
            width: width
        } : undefined]}>
            <View style={[styles.content,
            color ? {
                borderColor: color
            } : null,
            bdWidth ? {
                borderWidth: bdWidth
            } : null,
            bdStyle === 'dotted' && {
                borderStyle: 'dotted'
            },
            bdStyle === 'solid' && {
                borderStyle: 'solid'
            }
            ]}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { height: 1, overflow: 'hidden' },
    content: { borderWidth: 1, borderColor: Color.primary[200], borderStyle: 'dashed' }
});
export default Divider;