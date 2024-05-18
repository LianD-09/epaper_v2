import { Image, StyleSheet, View } from "react-native"
import Color, { toOpacity } from "../../themes/color";
import React from "react";
import Typography from "../../libs/typography";
import fontSize from "../../themes/font-size";
import fontWeight from "../../themes/font-weight";
import Card from "../../libs/card";

export type NewItemProps = {
    color?: string;
    label: string;
    icon?: React.ReactNode;
    onPress?: (...args: any) => any;
}

const NewItem = ({
    color,
    label,
    icon = <Image source={require('assets/icons/next-48px.png')} style={{ width: 16, height: 16 }} tintColor={Color.white[100]} />,
    onPress
}: NewItemProps) => {
    return (
        <Card style={styles.container} bgColor={color} pt={20} pb={20} onPress={onPress} pressOpacity={0.5}>
            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w600} color={Color.white[100]}>
                {label}
            </Typography>
            <View style={{ borderRadius: 999, padding: 5, backgroundColor: toOpacity(0.2, Color.primary[400]) }}>
                {icon}
            </View>
        </Card>
    )
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})

export default NewItem;