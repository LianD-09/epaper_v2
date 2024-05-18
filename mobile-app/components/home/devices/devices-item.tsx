import React from "react";
import { StyleSheet, View } from "react-native"
import Color from "../../../themes/color";
import Typography from "../../../libs/typography";
import fontSize from "../../../themes/font-size";
import fontWeight from "../../../themes/font-weight";
import Card from "../../../libs/card";
import Divider from "../../../libs/divider";
import { DataType, Status, Template } from "../../../types/type";
import { capitalize } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { openBottomModal } from "../../../redux/slice/bottom-modal-slice";
import { navigate } from "../../../navigation/root-navigation";
import { EditDataScreenProps, EditDevicesScreenProps, RootStackHomeParamList } from "../../../navigation/param-types";
import DevicesDetail from "./devices-detail";

export type DevicesItemProps = {
    id: string | number,
    name: string,
    status: Status,
    dataType: DataType,
    dataId: string | number,
    dataName: string,
    ssid: string,
    pass: string,
    createdBy: string | number,
}

const DevicesItem = ({
    id,
    name,
    status,
    dataName,
    ssid,
    dataType,
    ...detailData
}: DevicesItemProps) => {
    const dispatch = useDispatch();
    let color;

    switch (status) {
        case Status.ACTIVE:
            color = Color.success[600];
            break;
        case Status.INACTIVE:
            color = Color.error[800];
            break;
        case Status.PENDING:
            color = Color.secondary[600];
            break;
        case Status.UNKNOWN:
            color = Color.disable[500];
            break;
    }

    const onPress = () => {
        dispatch(openBottomModal({
            isOpen: true,
            isFailed: false,
            title: name,
            btnTitle: "Edit",
            btnCancelTitle: "Close",
            content: <DevicesDetail id={id} dataType={dataType} dataName={dataName} name={name} status={status} ssid={ssid} {...detailData} />,
            callback: () => {
                navigate<EditDevicesScreenProps, RootStackHomeParamList>('EditDevicesScreen', {
                    data: {
                        id,
                        name,
                        dataName,
                        ssid,
                        dataID: detailData.dataId,
                        active: status === Status.ACTIVE,
                        ...detailData
                    },
                })
            }
        }));
    }

    return (
        <Card style={styles.mainContainer} onPress={onPress} pressOpacity={0.5}>
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800}>{name}</Typography>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} color={color}>{capitalize(Status[status])}</Typography>
            </View>
            <Divider />
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w600}>{dataName}</Typography>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w600}>{ssid}</Typography>
            </View>
        </Card>
    )
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Color.primary[100],
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        width: '100%'
    }
})

export default DevicesItem;