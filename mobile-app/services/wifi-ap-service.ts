import { instanceAdhoc } from "./axios"

const instance = instanceAdhoc;

const urlEnpoint = instance.getUri() + '/cgi';
const urlRestart = instance.getUri() + '/restart';


export const getSettings = async () => {
    try {
        const res = await instance.get(urlEnpoint + '/settings');
        return res;
    }
    catch (e) {
        console.log(e);
        // throw new Error('Get settings failed. Make sure wifi AP mode is enable.');
        throw e
    }
}

export const getScannedWifi = async () => {
    try {
        const res = await instance.get(urlEnpoint + '/scan');
        return res;
    }
    catch (e) {
        console.log(e);
        throw new Error('Scan wifi access point failed. Make sure wifi AP mode is enable.');
    }
}

export const updateWifiInfo = async (data: {
    ssid: string,
    pass: string,
    deviceId?: string,
}) => {
    try {
        const res = await instance.get(urlEnpoint + `/save?s=${data.ssid}&p=${data.pass}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw new Error('Update wifi failed. Make sure wifi AP mode is enable.');
    }
}

export const clearSettings = async () => {
    try {
        const res = await instance.get(urlEnpoint + `/save?clear=true`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw new Error('Clear settings failed. Make sure wifi AP mode is enable.');
    }
}

export const restartDevice = async () => {
    try {
        const res = await instance.get(urlRestart);
        return res;
    }
    catch (e) {
        console.log(e);
        throw new Error('Restart device failed. Make sure wifi AP mode is enable.');
    }
}