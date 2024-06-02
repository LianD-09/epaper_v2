import React from "react";
import { StyleSheet, View } from "react-native"
import Color from "../../../themes/color";
import Typography from "../../../libs/typography";
import fontSize from "../../../themes/font-size";
import fontWeight from "../../../themes/font-weight";
import Card from "../../../libs/card";
import { Client, DataType, Employee, Image_, Product, Room, Status, Student, Template } from "../../../types/type";
import { capitalize } from "../../../utils/utils";
import Divider from "../../../libs/divider";

export type DataDetailProps = {
    id: string | number,
    name: string;
    deviceName: string;
    status: Status;
    dataType: DataType;
    data: Template
}

const DataDetail = ({
    id,
    name,
    deviceName,
    status,
    dataType,
    data
}: DataDetailProps) => {
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

    const renderByType = () => {
        switch (dataType) {
            case DataType.PRODUCT: {
                let item = data as Product;
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Category:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.category}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Price:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.price}</Typography>
                        </View>
                    </>
                );
            }
            case DataType.CLIENT: {
                let item = data as Client;
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Email:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.email}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Address:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.address}</Typography>
                        </View>
                    </>
                );
            }
            case DataType.EMPLOYEE: {
                let item = data as Employee;
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Email:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.email}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Employee ID:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.employeeId}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Department:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.department}</Typography>
                        </View>
                    </>
                );
            }
            case DataType.ROOM: {
                let item = data as Room;
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Purpose:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.purpose}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Manager:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.manager}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Status:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.roomStatus}</Typography>
                        </View>
                    </>
                );
            }
            case DataType.STUDENT: {
                let item = data as Student;
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Email:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.email}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Student ID:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.studentId}</Typography>
                        </View><View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Class:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{item.class}</Typography>
                        </View>
                    </>
                );
            }
            case DataType.IMAGE:
                {
                    let item = data as Image_;
                    return null;
                }
            default:
                return null;
        }
    }

    return (
        <Card style={styles.mainContainer} bgColor={Color.info[50]}>
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>ID:</Typography>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>{id}</Typography>
            </View>
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Device:</Typography>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>{deviceName}</Typography>
            </View>
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Type:</Typography>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>{capitalize(dataType)}</Typography>
            </View>
            <View style={styles.itemRow}>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Status:</Typography>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800} color={color}>{capitalize(Status[status])}</Typography>
            </View>
            <Divider />
            {renderByType()}
        </Card>
    )
};

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 16
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        width: '100%'
    }
})

export default DataDetail;