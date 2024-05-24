import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native"
import Color from "../../../themes/color";
import Typography from "../../../libs/typography";
import fontSize from "../../../themes/font-size";
import fontWeight from "../../../themes/font-weight";
import Card from "../../../libs/card";
import { Client, DataRaw, DataType, Employee, Product, Room, Status, Student, Template } from "../../../types/type";
import { capitalize } from "../../../utils/utils";
import Divider from "../../../libs/divider";

export type DevicesDetailProps = {
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

const DevicesDetail = ({
    id,
    name,
    dataName,
    status,
    dataType,
    ssid,
    pass,
    dataId,
    createdBy
}: DevicesDetailProps) => {
    let color;
    const [dataDetail, setDataDetail] = useState<Template>();

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

    useEffect(() => {
        //call api
        let data: DataRaw = {
            id,
            type: 'Employee',
            name: 'Thịt gà',
            input2: 'Thực phẩm',
            input3: '10000',
            input4: 'Available',
            active: true,
            activeStartTime: 1715438397,
            deviceName: 'EPD 01',
            deviceID: 1,
            activeTimestamp: [],
            fontStyle: 'Monospace 12pt',
            designSchema: 'Theme 1',
            createdBy: 1,
        };
        let newData: Template;
        switch (dataType) {
            case DataType.PRODUCT: {
                let item: Product;
                item = {
                    ...data,
                    category: data.input2 ?? '',
                    price: data.input3 ?? '',
                }
                newData = item;
                setDataDetail(newData);
                break;
            }
            case DataType.CLIENT: {
                let item: Client;
                item = {
                    ...data,
                    email: data.input2 ?? '',
                    address: data.input3 ?? '',
                }
                newData = item;
                setDataDetail(newData);
                break;
            }
            case DataType.EMPLOYEE: {
                let item: Employee;
                item = {
                    ...data,
                    email: data.input2 ?? '',
                    employeeId: data.input3 ?? '',
                    department: data.input4 ?? '',
                }
                newData = item;
                setDataDetail(newData);
                break;
            }
            case DataType.ROOM: {
                let item: Room;
                item = {
                    ...data,
                    purpose: data.input2 ?? '',
                    manager: data.input3 ?? '',
                    roomStatus: data.input4 ?? '',
                }
                newData = item;
                setDataDetail(newData);
                break;
            }
            case DataType.STUDENT: {
                let item: Student;
                item = {
                    ...data,
                    email: data.input2 ?? '',
                    studentId: data.input3 ?? '',
                    class: data.input4 ?? ''
                }
                newData = item;
                setDataDetail(newData);
                break;
            }
            default:
                break;
        }
    }, [])

    const renderByType = () => {
        switch (dataType) {
            case DataType.PRODUCT:
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800}>Category:</Typography>
                            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w600}>{(dataDetail as Product)?.category}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w800}>Price:</Typography>
                            <Typography fontSize={fontSize.Medium} fontFamily={fontWeight.w600}>{(dataDetail as Product)?.price}</Typography>
                        </View>
                    </>
                );
            case DataType.CLIENT:
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Email:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Client)?.email}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Address:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Client)?.address}</Typography>
                        </View>
                    </>
                );
            case DataType.EMPLOYEE:
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Email:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Employee)?.email}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Employee ID:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Employee)?.employeeId}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Department:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Employee)?.department}</Typography>
                        </View>
                    </>
                );
            case DataType.ROOM:
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Purpose:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Room)?.purpose}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Manager:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Room)?.manager}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Status:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Room)?.roomStatus}</Typography>
                        </View>
                    </>
                );
            case DataType.STUDENT:
                return (
                    <>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Email:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Student)?.email}</Typography>
                        </View>
                        <View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Student ID:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Student)?.studentId}</Typography>
                        </View><View style={styles.itemRow}>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Class:</Typography>
                            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{(dataDetail as Student)?.class}</Typography>
                        </View>
                    </>
                );
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
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Status:</Typography>
                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800} color={color}>{capitalize(Status[status])}</Typography>
            </View>
            <Divider />
            <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w900}>Data information</Typography>
            <Card bgColor={Color.secondary[100]}>
                <View style={styles.itemRow}>
                    <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Type:</Typography>
                    <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>{capitalize(DataType[dataType])}</Typography>
                </View>
                <View style={styles.itemRow}>
                    <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Name:</Typography>
                    <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>{dataName}</Typography>
                </View>
                {renderByType()}
            </Card>
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

export default DevicesDetail;