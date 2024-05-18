/* eslint-disable no-bitwise */
import React, { useCallback, useEffect, useState } from 'react';
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
} from 'react-native-ble-plx';
import { decodeValue } from '../utils/utils';

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
    scanForPeripherals(): void;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    connectedDevice: Device | null;
    allDevices: Device[];
}

function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForPeripherals = async () => {
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

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            console.log('Connected');
            await deviceConnection.services();
            console.log(await deviceConnection.characteristicsForService('0000abcd-0000-1000-8000-00805f9b1234'));
            const val = await deviceConnection.readCharacteristicForService('0000abcd-0000-1000-8000-00805f9b1234', '00001235-0000-1000-8000-00805f9b34fb');
            console.log(decodeValue(val.value ?? ''))

        } catch (e) {
            console.log('FAILED TO CONNECT', e);
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

    const isEnabledBLELocation = () => {

    };

    useEffect(() => {
        return () => {
            disconnectFromDevice();
        }
    }, [disconnectFromDevice]);

    return {
        scanForPeripherals,
        connectToDevice,
        allDevices,
        connectedDevice,
        disconnectFromDevice,
    };
}

export default useBLE;