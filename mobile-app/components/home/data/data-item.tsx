import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native"
import Color from "../../../themes/color";
import Typography from "../../../libs/typography";
import fontSize from "../../../themes/font-size";
import fontWeight from "../../../themes/font-weight";
import Card from "../../../libs/card";
import Divider from "../../../libs/divider";
import { Client, DataRaw, DataType, Employee, Image_, Product, Room, Status, Student, Template } from "../../../types/type";
import { capitalize } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { openBottomModal } from "../../../redux/slice/bottom-modal-slice";
import DataDetail from "./data-detail";
import { navigate } from "../../../navigation/root-navigation";
import { EditDataScreenProps, RootStackHomeParamList } from "../../../navigation/param-types";

export type DataItemProps = {
    id: string | number,
    name: string;
    deviceName: string;
    status: Status;
    dataType: DataType;
    data: DataRaw
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
    const formatData: Template = useMemo(() => {
        switch (dataType) {
            case DataType.PRODUCT:
                return ({
                    ...data,
                    id: data._id,
                    category: data.input2,
                    price: data.input3,
                }) as Product;
            case DataType.CLIENT:
                return ({
                    ...data,
                    id: data._id,
                    email: data.input2,
                    address: data.input3,
                }) as Client;
            case DataType.EMPLOYEE:
                return ({
                    ...data,
                    id: data._id,
                    email: data.input2,
                    employeeId: data.input3,
                    department: data.input4,
                }) as Employee;
            case DataType.ROOM:
                return ({
                    ...data,
                    id: data._id,
                    purpose: data.input2,
                    manager: data.input3,
                    roomStatus: data.input4,
                }) as Room;
            case DataType.STUDENT:
                return ({
                    ...data,
                    id: data._id,
                    email: data.input2,
                    studentId: data.input3,
                    class: data.input4,
                }) as Student;
            case DataType.IMAGE:
                return ({
                    ...data,
                    id: data._id,
                    data: data.input2,
                    direction: data.input3,
                }) as Image_;
        }
    }, [data]);

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
            content: <DataDetail id={id} dataType={dataType} deviceName={deviceName} name={name} status={status} data={formatData} />,
            callback: () => {
                navigate<EditDataScreenProps, RootStackHomeParamList>('EditDataScreen', {
                    data: formatData as Template,
                    dataType: dataType,
                })
            }
        }));
    }

    return (
        <Card style={styles.mainContainer} onPress={onPress} pressOpacity={0.5}>
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} color={!!deviceName ? Color.primary[700] : Color.disable[400]}>{!!deviceName ? deviceName : "No device"}</Typography>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} color={color}>{capitalize(Status[status])}</Typography>
            </View>
            <Divider />
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} style={{ flex: 9 }} textAlign="left" numberOfLines={1}>{name}</Typography>
                <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800} style={{ flex: 0 }}>{capitalize(dataType)}</Typography>
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