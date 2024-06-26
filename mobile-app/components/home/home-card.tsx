import { Image, Pressable, StyleSheet, View, } from "react-native"
import Color from "../../themes/color";
import { forwardRef } from "react";
import React from "react";
import Typography from "../../libs/typography";
import fontSize from "../../themes/font-size";
import fontWeight from "../../themes/font-weight";
import HomeItem, { HomeItemProps } from "./home-item";
import { DataRaw, DataType, DeviceRaw } from "../../types/type";
import { capitalize } from "../../utils/utils";

type HomeCardProps = {
    title: TitleEnum,
    data?: Array<DataRaw> | Array<DeviceRaw>,
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
                        description: `${data?.filter((e, index) => (e as DataRaw).type === capitalize(DataType.PRODUCT)).length} data`
                    },
                    {
                        color: Color.orange[700],
                        label: 'Student',
                        description: `${data?.filter((e, index) => (e as DataRaw).type === capitalize(DataType.STUDENT)).length} data`
                    },
                    {
                        color: Color.info[600],
                        label: 'Employee',
                        description: `${data?.filter((e, index) => (e as DataRaw).type === capitalize(DataType.EMPLOYEE)).length} data`
                    },
                    {
                        color: Color.primary[600],
                        label: 'Client',
                        description: `${data?.filter((e, index) => (e as DataRaw).type === capitalize(DataType.CLIENT)).length} data`
                    },
                    {
                        color: Color.success[500],
                        label: 'Room',
                        description: `${data?.filter((e, index) => (e as DataRaw).type === capitalize(DataType.ROOM)).length} data`
                    },
                    {
                        color: Color.secondary[600],
                        label: 'Image',
                        description: `${data?.filter((e, index) => (e as DataRaw).type === capitalize(DataType.IMAGE)).length} data`
                    },
                ];
                break;
            case TitleEnum.devices:
                list = [
                    {
                        color: Color.primary[600],
                        label: 'Total',
                        description: `${data?.length} devices`
                    },
                    {
                        color: Color.success[500],
                        label: 'Active',
                        description: `${data?.filter((e, index) => (e as DeviceRaw).active === true).length} devices`
                    },
                    {
                        color: Color.error[800],
                        label: 'Inactive',
                        description: `${data?.filter((e, index) => (e as DeviceRaw).active === false).length} devices`
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
                <Typography fontSize={fontSize.Big} fontFamily={fontWeight.w700} >
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