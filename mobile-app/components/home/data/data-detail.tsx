import React from "react";
import { StyleSheet, Text, View } from "react-native"
import Color from "../../../themes/color";
import Typography from "../../../libs/typography";
import fontSize from "../../../themes/font-size";
import fontWeight from "../../../themes/font-weight";
import Card from "../../../libs/card";
import { Client, DataType, Employee, Image_, Product, Room, Status, Student, Template } from "../../../types/type";
import { capitalize } from "../../../utils/utils";
import Divider from "../../../libs/divider";
import WebView from "react-native-webview";
import { decodeImageData } from "../../../services/image-services";

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
                    const pixels = decodeImageData(item.data);
                    const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="display:flex;flex-direction:column;justify-content:center;align-items:center">
                        <div style="display:flex;align-items:center;justify-content:center;flex-direction:column;flex:1;">
                            <canvas id="canvas" width="128" height="296"></canvas>
                        </div>
                        <script>
                        const byteArray = ${JSON.stringify(pixels)};
                        const canvas = document.getElementById('canvas');
                        const ctx = canvas.getContext('2d');
                        const imageData = ctx.createImageData(128, 296);
                        for (let i = 0; i < byteArray.length; i++) {
                            const value = byteArray[i];
                            const idx = i * 4;
                            imageData.data[idx] = value;
                            imageData.data[idx + 1] = value;
                            imageData.data[idx + 2] = value;
                            imageData.data[idx + 3] = 255;
                        }
                        ctx.putImageData(imageData, 0, 0);
                        const dataUrl = canvas.toDataURL();
                        window.ReactNativeWebView.postMessage(dataUrl);
                        </script>
                    </body>
                    </html>
                `;
                    return (
                        <>
                            <View style={styles.itemRow}>
                                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w800}>Direction:</Typography>
                                <Typography fontSize={fontSize.Small} fontFamily={fontWeight.w600}>{capitalize(item.direction)}</Typography>
                            </View>
                            <View style={{
                                gap: 4,
                                transform: [{
                                    scale: 0.9
                                }]
                            }}>
                                {/* <View style={styles.buttonCustomViewLabel}>
                                    <Text style={styles.label}>Preview</Text>
                                </View> */}
                                <Card
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minWidth: 128 + 60,
                                        minHeight: 296 + 60,
                                        transform: [{
                                            rotate: item.direction === 'horizontal' ? '-90deg' : '0deg'
                                        }]
                                    }}
                                >
                                    <WebView
                                        originWhitelist={['*']}
                                        source={{ html: htmlContent }}
                                        style={[styles.webview, {
                                            width: 128 + 20,
                                            height: 296 + 20,
                                        }]}
                                        javaScriptEnabled={true}
                                    />
                                </Card >
                            </View>

                        </>
                    )
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
        marginTop: 16,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        width: '100%'
    },
    webview: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonCustomViewLabel: {
        flexDirection: "column",
        width: "100%",
    },
    label: {
        paddingHorizontal: 16,
        fontSize: fontSize.Tiny,
        fontFamily: fontWeight.w700,
        color: Color.primary[400],
    },
})

export default DataDetail;