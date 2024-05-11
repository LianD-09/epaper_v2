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
import DataDetail from "./data-detail";
import { navigate } from "../../../navigation/root-navigation";
import { EditDataScreenProps } from "../../../navigation/param-types";

export type DataItemProps = {
    id: string | number,
    name: string;
    deviceName: string;
    status: Status;
    dataType: DataType;
    data: any
}

const DataItem = ({
    id,
    name,
    deviceName,
    status,
    dataType,
    data
}: DataItemProps) => {
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
            content: <DataDetail id={id} dataType={dataType} deviceName={deviceName} name={name} status={status} data={data as Template} />,
            callback: () => {
                navigate<EditDataScreenProps>('EditDataScreen', {
                    data: data as Template,
                    dataType: dataType,
                })
            }
        }));
    }

    return (
        <Card style={styles.mainContainer} onPress={onPress} pressOpacity={0.5}>
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800}>{deviceName}</Typography>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} color={color}>{capitalize(Status[status])}</Typography>
            </View>
            <Divider />
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800}>{name}</Typography>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800}>{capitalize(DataType[dataType])}</Typography>
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

export default DataItem;