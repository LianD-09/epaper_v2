/* eslint-disable no-bitwise */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
    Service,
    State,
} from 'react-native-ble-plx';
import { decodeValue, encodeValue } from '../utils/utils';
import { BLEContext } from '../components/ble/ble-provider';
import { useDispatch } from 'react-redux';
import { openCenterModal } from '../redux/slice/center-modal-slice';
import Typography from '../libs/typography';
import * as Location from 'expo-location';
import { MAX_MTU, dataServiceAndCharacteristic, wifiServiceAndCharacteristic } from '../utils/constants';
import { DataType } from '../types/type';
import { encode } from 'base-64';

interface BluetoothLowEnergyApi {
    scanForPeripherals(reScan?: boolean): Promise<void>;
    connectToDevice: (deviceId: Device) => Promise<boolean>;
    disconnectFromDevice: () => void;
    stopScanDevices: () => void;
    requireEnableBLE: () => void;
    isEnabledBLELocation: () => Promise<boolean>;
    connectedDevice: Device | null;
    allDevices: Device[];
    isScanning: boolean,
    characteristics: Characteristic[];
    services: Service[];
    bleManager: BleManager;
    uniqueId: string;
    changeCharacteristicsValue: (serviceUUID: string, characteristicUUID: string, value: string, withResponse?: boolean) => Promise<boolean>;
    changeWifiConfiguration: (ssid: string, pass: string, topicId: string | number) => void;
    changeData: (
        dataType: DataType,
        data: {
            name: string,
            input2?: string | null,
            input3?: string | null,
            input4?: string | null,
            input5?: string | null,
            font: string,
            schema: string,
            dataId?: string,
        }
    ) => void;
    sendImage: (imageData: string) => Promise<number>;
}

function useBLE(required = true): BluetoothLowEnergyApi {
    const {
        bleManager,
        allDevices,
        setAllDevices,
        connectedDevice,
        setConnectedDevice,
        isScanning,
        setIsScanning,
        characteristics,
        setServices,
        services,
        setCharacteristics,
        uniqueId,
        setUniqueId
    } = useContext(BLEContext);

    const dispatch = useDispatch();
    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForPeripherals = async (reScan: boolean = false) => {
        if (await isEnabledBLELocation() === false) {
            return;
        }

        if (reScan) {
            setAllDevices([]);
        }
        setIsScanning(true);

        if (await bleManager.state() === State.PoweredOn) {
            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log(error);
                }

                if (!!device && device.name !== null) {
                    setAllDevices((prevState: Device[]) => {
                        if (!isDuplicteDevice(prevState, device)) {
                            return [...prevState, device];
                        }
                        return prevState;
                    });
                }
            });
        }
        setTimeout(() => {
            bleManager.stopDeviceScan();
            setIsScanning(false);
        }, 30 * 1000);
    }

    const connectToDevice = async (device: Device) => {
        let result = false;
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            // Request a larger MTU size
            await device.requestMTU(MAX_MTU + 5 + 3);

            await deviceConnection.discoverAllServicesAndCharacteristics();
            stopScanDevices();
            let servicesList = await deviceConnection.services();
            setServices(servicesList);
            let characteristicList: Characteristic[] = [];

            for (let i = 0; i < servicesList.length; i++) {
                let arr = [
                    wifiServiceAndCharacteristic,
                    dataServiceAndCharacteristic,
                ].find((value, index) => {
                    return value.uuid === servicesList[i].uuid;
                });

                if (arr != undefined) {
                    let items = await deviceConnection.characteristicsForService(servicesList[i].uuid);
                    characteristicList = [...characteristicList, ...items];
                }
            }

            setCharacteristics(characteristicList);


            // Read uniqueId to perform requesting key and save to variable
            const val = await deviceConnection.readCharacteristicForService(
                '00001a10-0000-1000-8000-00805f9b34fb',
                '00001a13-0000-1000-8000-00805f9b34fb'
            );

            setUniqueId(decodeValue(val.value ?? ''));

            result = true;
        } catch (e) {
            console.log('FAILED TO CONNECT', e);
            disconnectFromDevice();
            dispatch(openCenterModal({
                isOpen: false,
                isFailed: true,
                title: 'Something was wrong',
                content: 'Please, check your device state and choose correctly or retry again.',
                btnTitle: 'Close',
                btnCancelTitle: ''
            }));
        }
        return result;
    };

    const disconnectFromDevice = useCallback(async () => {
        try {
            if (connectedDevice !== null) {
                await bleManager.cancelDeviceConnection(connectedDevice.id);
                setConnectedDevice(null);
            }
        }
        catch (error) {
            console.log(error);

        }
    }, [connectedDevice]);

    const stopScanDevices = () => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
    }

    const isEnabledBLELocation = async () => {
        const isEnabled = await Location.hasServicesEnabledAsync();

        if (!isEnabled) {
            dispatch(openCenterModal({
                title: 'Enable Location',
                isOpen: true,
                isFailed: true,
                btnTitle: 'Close',
                btnCancelTitle: '',
                content: "You have to enable Location services to continue"
            }))
        }

        return isEnabled;
    };

    const changeCharacteristicsValue = async (serviceUUID: string, characteristicUUID: string, value: string, withResponse: boolean = true) => {
        let result = false;
        try {
            if (connectedDevice) {
                if (withResponse) {
                    await bleManager.writeCharacteristicWithResponseForDevice(
                        connectedDevice.id,
                        serviceUUID,
                        characteristicUUID,
                        encodeValue(value)
                    );
                }
                else {
                    await bleManager.writeCharacteristicWithoutResponseForDevice(
                        connectedDevice.id,
                        serviceUUID,
                        characteristicUUID,
                        encodeValue(value)
                    );
                }
                result = true;
            }
        }
        catch (e) {
            console.log(e);
            alert(e);
            result = false
        }
        return result;
    }

    const changeCharacteristicsValueForImage = async (serviceUUID: string, characteristicUUID: string, dataValue: string) => {
        let result = false;

        try {
            if (connectedDevice) {
                await bleManager.writeCharacteristicWithoutResponseForDevice(
                    connectedDevice.id,
                    serviceUUID,
                    characteristicUUID,
                    dataValue
                );
                result = true;
            }
        }
        catch (e) {
            console.log(e);
            result = false
        }
        return result;
    }

    const requireEnableBLE = () => {
        dispatch(openCenterModal({
            title: 'Enable Bluetooth',
            isOpen: true,
            isFailed: true,
            btnTitle: 'Turn on',
            callback: () => {
                bleManager.enable();
            },
            btnCancelTitle: 'Cancel',
            content: "You have to enable Bluetooth and Location to continue"
        }))
    }

    useEffect(() => {
        if (!required) {
            return () => {
                setAllDevices([]);
            }
        }

        const subscription = bleManager.onStateChange((state) => {  // check if device bluetooth is powered on, if not alert to enable it!
            if (state === 'PoweredOff') {
                requireEnableBLE();
            }
        }, true);

        return () => {
            subscription.remove();
            stopScanDevices();
            setAllDevices([]);
        }
    }, []);

    // Start service BLE
    const changeWifiConfiguration = async (ssid: string, pass: string, topicId: string | number) => {
        try {
            await changeCharacteristicsValue(
                wifiServiceAndCharacteristic.uuid,
                wifiServiceAndCharacteristic.characteristics.ssid,
                ssid
            );
            await changeCharacteristicsValue(
                wifiServiceAndCharacteristic.uuid,
                wifiServiceAndCharacteristic.characteristics.password,
                pass
            );
            await changeCharacteristicsValue(
                wifiServiceAndCharacteristic.uuid,
                wifiServiceAndCharacteristic.characteristics.topicId,
                topicId.toString()
            );
        }
        catch (e) {
            console.log(e);
            alert(e);
        }
    }

    const changeData = async (
        dataType: DataType,
        data: {
            name: string,
            input2?: string | null,
            input3?: string | null,
            input4?: string | null,
            input5?: string | null,
            font: string,
            schema: string,
            dataId?: string,
        }) => {
        try {
            await changeCharacteristicsValue(
                dataServiceAndCharacteristic.uuid,
                dataServiceAndCharacteristic.characteristics.name,
                data.name
            );
            if (!!data.input2) {
                await changeCharacteristicsValue(
                    dataServiceAndCharacteristic.uuid,
                    dataServiceAndCharacteristic.characteristics.input2,
                    data.input2 ?? ''
                );
            }
            if (!!data.input3) {
                await changeCharacteristicsValue(
                    dataServiceAndCharacteristic.uuid,
                    dataServiceAndCharacteristic.characteristics.input3,
                    data.input3 ?? ''
                );
            }
            if (!!data.input4) {
                await changeCharacteristicsValue(
                    dataServiceAndCharacteristic.uuid,
                    dataServiceAndCharacteristic.characteristics.input4,
                    data.input4 ?? ''
                );
            }
            if (!!data.input5) {
                await changeCharacteristicsValue(
                    dataServiceAndCharacteristic.uuid,
                    dataServiceAndCharacteristic.characteristics.input5,
                    data.input5 ?? ''
                );
            }
            await changeCharacteristicsValue(
                dataServiceAndCharacteristic.uuid,
                dataServiceAndCharacteristic.characteristics.font,
                data.font
            );
            await changeCharacteristicsValue(
                dataServiceAndCharacteristic.uuid,
                dataServiceAndCharacteristic.characteristics.schema,
                data.schema
            );
            if (!!data.dataId) {
                await changeCharacteristicsValue(
                    dataServiceAndCharacteristic.uuid,
                    dataServiceAndCharacteristic.characteristics.dataId,
                    data.dataId
                );
            }
            await changeCharacteristicsValue(
                dataServiceAndCharacteristic.uuid,
                dataServiceAndCharacteristic.characteristics.type,
                dataType
            );
        }
        catch (e) {
            console.log(e);
            alert(e);
        }
    }

    // Function to calculate checksum
    const _calculateChecksum = (data: string) => {
        let checksum = 0;
        for (let i = 0; i < data.length; i++) {
            checksum = (checksum + data.charCodeAt(i)) % 256;
        }
        return checksum;
    };

    const sendImage = async (imageData: string) => {
        let sentBytes = 0;
        try {
            // Define chunk size
            const chunkSize = MAX_MTU;

            // Send image data in chunks with checksum
            for (let i = 0; i < imageData.length; i += chunkSize) {
                const chunkData = imageData.slice(i, i + chunkSize);
                const checksum = _calculateChecksum(chunkData);
                const length = chunkData.length;
                const dataWithChecksum =
                    (length < 16 ? '0' + length.toString(16) : length.toString(16)) +
                    chunkData +
                    (checksum < 16 ? '0' + checksum.toString(16) : checksum.toString(16)) +
                    (i + chunkSize >= imageData.length ? '1' : '0');

                await changeCharacteristicsValueForImage(
                    dataServiceAndCharacteristic.uuid,
                    dataServiceAndCharacteristic.characteristics.image,
                    encode(dataWithChecksum)
                );

                sentBytes += length;
            }

        } catch (error) {
            console.error(error);
            return 0;
        }
        return sentBytes;
    }

    return {
        isScanning,
        isEnabledBLELocation,
        scanForPeripherals,
        connectToDevice,
        requireEnableBLE,
        allDevices,
        connectedDevice,
        characteristics,
        services,
        bleManager,
        uniqueId,
        disconnectFromDevice,
        changeCharacteristicsValue,
        changeWifiConfiguration,
        changeData,
        stopScanDevices,
        sendImage,
    };
}

export default useBLE;