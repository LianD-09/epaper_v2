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
import { closeBottomModal, openBottomModal } from "../../../redux/slice/bottom-modal-slice";
import { navigate, navigateThroughStack, pop } from "../../../navigation/root-navigation";
import { EditDevicesScreenProps, NewDeviceScreenProps, RootStackHomeParamList, RootStackNewParamList } from "../../../navigation/param-types";
import DevicesDetail from "./devices-detail";
import { openCenterModal } from "../../../redux/slice/center-modal-slice";
import Button from "../../../libs/button";
import { closeLoading, openLoading } from "../../../redux/slice/loading-slice";
import { deleteDevice } from "../../../services/device-services";

export type DevicesItemProps = {
    id: string | number,
    name: string,
    status: Status,
    dataId: string | number,
    dataName: string,
    ssid: string,
    pass: string,
    createdBy: string | number,
    uniqueID: string
}

const DevicesItem = ({
    id,
    name,
    status,
    dataName,
    ssid,
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

    const handleDelete = () => {
        // call api
        dispatch(closeBottomModal());
        dispatch(openCenterModal({
            isOpen: true,
            isFailed: false,
            title: 'Warning',
            content: 'Are you sure you want to delete this device? This device and its data display status will be deleted.',
            btnTitle: 'Yes',
            callback: async () => {
                try {
                    dispatch(openLoading());
                    await deleteDevice(id);

                    dispatch(openBottomModal({
                        isOpen: true,
                        isFailed: false,
                        title: 'Successful',
                        content: 'This device has been removed.',
                        btnTitle: 'Close',
                        callback: () => pop(),
                        btnCancelTitle: ''
                    }))
                }
                catch (e) {
                    console.log(e);
                    dispatch(openBottomModal({
                        isOpen: true,
                        isFailed: true,
                        title: 'Failed',
                        content: 'Something was wrong. Please try again.',
                        btnTitle: 'Close',
                        btnCancelTitle: ''
                    }))
                }
                finally {
                    dispatch(closeLoading());
                }
            },
            btnCancelTitle: 'Cancel',
        }))
    }


    const onPress = () => {
        dispatch(openBottomModal({
            isOpen: true,
            isFailed: false,
            title: name,
            btnTitle: "Edit",
            btnMores: (status !== Status.ACTIVE) ?
                [
                    <Button onPress={handleDelete} deleted>Delete</Button>
                ]
                : undefined,
            btnCancelTitle: "Close",
            content: <DevicesDetail id={id} dataName={dataName} name={name} status={status} ssid={ssid} {...detailData} />,
            callback: () => {
                if (status === Status.ACTIVE) {
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
                else {
                    dispatch(openCenterModal({
                        isOpen: false,
                        isFailed: false,
                        title: "Notification",
                        content: 'This device is inactive, you need to scan device before continue.',
                        btnTitle: "Continue",
                        callback: () => navigateThroughStack<NewDeviceScreenProps, RootStackNewParamList>(
                            'New',
                            'NewDeviceScreen',
                            { mode: 'bluetooth' }
                        ),
                        btnCancelTitle: "Cancel"
                    }));
                }
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