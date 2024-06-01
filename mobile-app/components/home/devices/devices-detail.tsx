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
import { getDataById } from "../../../services/data-services";
import { openCenterModal } from "../../../redux/slice/center-modal-slice";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";

export type DevicesDetailProps = {
    id: string | number,
    name: string,
    status: Status,
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
    ssid,
    pass,
    dataId,
    createdBy
}: DevicesDetailProps) => {
    let color;
    const dispatch = useDispatch();
    const [dataDetail, setDataDetail] = useState<Template>();
    const [rawData, setRawData] = useState<DataRaw>();

    const getDataForDevice = async () => {
        try {
            const res = await getDataById(dataId);
            const data: DataRaw = res.data.data as DataRaw;
            setRawData(data);

            let newData: Template;
            switch (data?.type?.toLowerCase()) {
                case DataType.PRODUCT: {
                    let item: Product;
                    item = {
                        ...data,
                        id: data._id,
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
                        id: data._id,
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
                        id: data._id,
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
                        id: data._id,
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
                        id: data._id,
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
        }
        catch (e) {
            dispatch(openCenterModal({
                isOpen: true,
                isFailed: true,
                title: 'Fetch devices and data failed',
                content: (e as AxiosError).message,
                btnTitle: 'Close',
                btnCancelTitle: ''
            }));
        }
    }

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
        getDataForDevice();
    }, [])

    const renderByType = () => {
        switch (rawData?.type?.toLowerCase()) {
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
                    <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>{capitalize(rawData?.type ?? '')}</Typography>
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