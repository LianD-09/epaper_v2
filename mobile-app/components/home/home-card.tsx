import { Image, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import Color from "../../themes/color";
import { LegacyRef, forwardRef } from "react";
import React from "react";
import Typography from "../../libs/typography";
import fontSize from "../../themes/font-size";
import fontWeight from "../../themes/font-weight";
import Card from "../../libs/card";
import HomeItem, { HomeItemProps } from "./home-item";

type HomeCardProps = {
    title: TitleEnum,
    data?: any,
    navigation: any,
}

export enum TitleEnum {
    data,
    devices
}

const HomeCard = forwardRef<View, HomeCardProps>(({
    title,
    data,
    navigation
}, ref) => {

    const handlePressTitle = () => {
        if (title === TitleEnum.data) {
            navigation.navigate('DataScreen');
        }
        else {
            navigation.navigate('DevicesScreen');
        }
    }

    const renderByTitle = () => {
        let list: Array<HomeItemProps> = []
        switch (title) {
            case TitleEnum.data:
                list = [
                    {
                        color: Color.purple[600],
                        label: 'Product',
                        description: '10 datas'
                    },
                    {
                        color: Color.orange[700],
                        label: 'Student',
                        description: '10 datas'
                    },
                    {
                        color: Color.info[600],
                        label: 'Employee',
                        description: '10 datas'
                    },
                    {
                        color: Color.primary[600],
                        label: 'Client',
                        description: '10 datas'
                    },
                    {
                        color: Color.success[500],
                        label: 'Room',
                        description: '10 datas'
                    },
                ];
                break;
            case TitleEnum.devices:
                list = [
                    {
                        color: Color.primary[600],
                        label: 'Total',
                        description: '20 devices'
                    },
                    {
                        color: Color.success[500],
                        label: 'Active',
                        description: '10 devices'
                    },
                    {
                        color: Color.error[800],
                        label: 'Inactive',
                        description: '10 devices'
                    },
                ];
                break;
            default:
                return null;
        }
        return (
            list.map((e, index) => <HomeItem {...e} key={index} />)
        )
    }

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.title}
                onPress={handlePressTitle}
            >
                {title === TitleEnum.data ?
                    <Image source={require('assets/icons/data-128px.png')} style={{ width: 24, height: 24 }} tintColor={Color.primary[700]} />
                    :
                    <Image source={require('assets/icons/devices-48px.png')} style={{ width: 24, height: 24 }} tintColor={Color.primary[700]} />
                }
                <Typography fontSize={fontSize.VeryBig} fontFamily={fontWeight.w700} >
                    {title === TitleEnum.data ? 'Data dashboard' : 'Devices dashboard'}
                </Typography>
                <Image source={require('assets/icons/next-48px.png')} style={{ width: 24, height: 24 }} tintColor={Color.primary[700]} />
            </Pressable>
            {renderByTitle()}
        </View>
    )
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        gap: 5,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})

export default HomeCard;