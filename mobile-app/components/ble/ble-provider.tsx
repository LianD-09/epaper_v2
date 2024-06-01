import React from 'react';
import { createContext, useState } from 'react'
import { BleManager, Characteristic, Device, Service } from 'react-native-ble-plx';

interface BLEProviderContextValues {
    bleManager: BleManager;
    connectedDevice: Device | null;
    setConnectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
    allDevices: Device[];
    setAllDevices: React.Dispatch<React.SetStateAction<Device[]>>;
    isScanning: boolean;
    setIsScanning: React.Dispatch<React.SetStateAction<boolean>>
    services: Service[],
    setServices: React.Dispatch<React.SetStateAction<Service[]>>,
    characteristics: Characteristic[],
    setCharacteristics: React.Dispatch<React.SetStateAction<Characteristic[]>>,
    uniqueId: string,
    setUniqueId: React.Dispatch<React.SetStateAction<string>>
}

export const BLEContext = createContext<BLEProviderContextValues>({
    bleManager: new BleManager,
    connectedDevice: null,
    setConnectedDevice: (value) => null,
    allDevices: [],
    setAllDevices: (value) => [],
    isScanning: false,
    setIsScanning: (value) => false,
    services: [],
    setServices: (value) => [],
    characteristics: [],
    setCharacteristics: (value) => [],
    uniqueId: '',
    setUniqueId: (value) => '',
});

const { Provider } = BLEContext;

interface BLEProviderProps {
    children: React.ReactNode,
    bleManager: BleManager
}

export const BLEProvider = ({ children, bleManager }: BLEProviderProps) => {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [uniqueId, setUniqueId] = useState<string>('');

    return (
        <Provider value={{
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
        }}>
            {children}
        </Provider>
    )
}