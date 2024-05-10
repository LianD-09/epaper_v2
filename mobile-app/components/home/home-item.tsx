import { StyleSheet } from "react-native"
import Color from "../../themes/color";
import React from "react";
import Typography from "../../libs/typography";
import fontSize from "../../themes/font-size";
import fontWeight from "../../themes/font-weight";
import Card from "../../libs/card";

export type HomeItemProps = {
    color?: string;
    label: string;
    description: string;
}

const HomeItem = ({
    color,
    label,
    description
}: HomeItemProps) => {
    return (
        <Card style={styles.container} bgColor={color} pt={30} pb={30}>
            <Typography fontSize={fontSize.Big} fontFamily={fontWeight.w600} color={Color.white[100]}>
                {label}
            </Typography>
            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w300} color={Color.white[100]}>
                {description}
            </Typography>
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

export default HomeItem;