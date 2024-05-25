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
import { dataServiceAndCharacteristic, imageServiceAndCharacteristic, wifiServiceAndCharacteristic } from '../utils/constants';
import { DataType } from '../types/type';

interface BluetoothLowEnergyApi {
    scanForPeripherals(reScan?: boolean): void;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    stopScanDevices: () => void;
    connectedDevice: Device | null;
    allDevices: Device[];
    isScanning: boolean,
    characteristics: Characteristic[];
    services: Service[];
    changeCharacteristicsValue: (serviceUUID: string, characteristicUUID: string, value: string, withResponse?: boolean) => Promise<boolean>;
    changeWifiConfiguration: (ssid: string, pass: string) => void;
    changeData: (
        dataType: DataType,
        data: {
            name: string,
            input2?: string,
            input3?: string,
            input4?: string,
            input5?: string,
            font: string,
            schema: string,
            dataId?: string,
        }
    ) => void;
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
    } = useContext(BLEContext);
    bleManager

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
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            stopScanDevices();
            console.log('Connected');
            let servicesList = await deviceConnection.services();
            setServices(servicesList);
            let characteristicList: Characteristic[] = [];

            for (let i = 0; i < servicesList.length; i++) {
                let arr = [
                    wifiServiceAndCharacteristic,
                    dataServiceAndCharacteristic,
                    imageServiceAndCharacteristic
                ].find((value, index) => {
                    return value.uuid === servicesList[i].uuid;
                });

                if (arr != undefined) {
                    let items = await deviceConnection.characteristicsForService(servicesList[i].uuid);
                    characteristicList = [...characteristicList, ...items];
                }
            }

            setCharacteristics(characteristicList);


            // Read wifi ssid to perform requesting key
            const val = await deviceConnection.readCharacteristicForService(
                '00001a10-0000-1000-8000-00805f9b34fb',
                '00001a11-0000-1000-8000-00805f9b34fb'
            );
            console.log(decodeValue(val.value ?? ''))

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
    };

    const disconnectFromDevice = useCallback(async () => {
        try {
            if (connectedDevice !== null) {
                console.log('Disconnected');

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
            alert(e);
            result = false
        }
        return result;
    }

    useEffect(() => {
        if (!required) {
            return () => {
                setAllDevices([]);
            }
        }

        const subscription = bleManager.onStateChange((state) => {  // check if device bluetooth is powered on, if not alert to enable it!
            if (state === 'PoweredOff') {
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
        }, true);

        return () => {
            subscription.remove();
            stopScanDevices();
            setAllDevices([]);
        }
    }, []);

    // Start service BLE
    const changeWifiConfiguration = async (ssid: string, pass: string) => {
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
            input2?: string,
            input3?: string,
            input4?: string,
            input5?: string,
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

    return {
        isScanning,
        scanForPeripherals,
        connectToDevice,
        allDevices,
        connectedDevice,
        characteristics,
        services,
        disconnectFromDevice,
        changeCharacteristicsValue,
        changeWifiConfiguration,
        changeData,
        stopScanDevices,
    };
}

export default useBLE;