import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from "react-native"
import Color from "../../themes/color";
import React, { memo } from "react";
import Typography from "../../libs/typography";
import fontSize from "../../themes/font-size";
import fontWeight from "../../themes/font-weight";
import Card from "../../libs/card";

type FeaturesCardProps = {}

type FeatureItemType = {
    iconSrc?: ImageSourcePropType,
    color?: string,
    label?: string
}

const FeaturesItem = memo((props: FeatureItemType) => {
    return (
        <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 5 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 999, height: 48, width: 48, backgroundColor: props.color }}>
                    <Image source={props.iconSrc} style={{ width: 24, height: 24 }} tintColor={Color.white[100]} />
                </View>
                <Typography fontSize={fontSize.Tiny} fontFamily={fontWeight.w500}>{props.label}</Typography>
            </View>
        </View>
    );
})

const listFeatures: Array<FeatureItemType> = [
    {
        color: Color.primary[400],
        label: 'Scan device',
        iconSrc: require("assets/icons/qr-scan-48px.png"),
    },
    {
        color: Color.secondary[600],
        label: 'New data',
        iconSrc: require("assets/icons/add-data-24px.png"),
    },
    {
        color: Color.info[600],
        label: 'Bluetooth connect',
        iconSrc: require("assets/icons/bluetooth-48px.png"),
    },
    {
        color: Color.success[600],
        label: 'Wifi devices connect',
        iconSrc: require("assets/icons/wifi-epd-48px.png"),
    },
]

const FeaturesCard = (props: FeaturesCardProps) => {

    return (
        <View style={styles.container}>
            <ScrollView scrollEnabled={false} style={{ flex: 1 }} contentContainerStyle={styles.listContainer} showsHorizontalScrollIndicator={false}>
                {listFeatures.map((e, index) => (
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 5, flex: 1 }} activeOpacity={0.5} key={index}>
                        <FeaturesItem {...e} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        gap: 15,
        marginBottom: 10
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    listContainer: {
        flexGrow: 1,
        gap: 15,
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden'
    }
})

export default memo(FeaturesCard);