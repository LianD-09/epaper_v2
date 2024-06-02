import { DeviceRaw } from "../types/type";
import { instanceToken } from "./axios";

const instance = instanceToken;

const urlEndpoint = instance.getUri() + '/devices';


export const getAllDevices = async () => {
    try {
        const res = await instance.get(`${urlEndpoint}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const getActiveDevices = async () => {
    try {
        const res = await instance.get(`${urlEndpoint}`, {
            params: {
                active: true
            }
        });
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const getDeviceById = async (id: string | number) => {
    try {
        const res = await instance.get(`${urlEndpoint}/${id}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const createDevice = async (data: Omit<DeviceRaw, '_id' | 'createdBy'>) => {
    try {
        const res = await instance.post(`${urlEndpoint}`, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const updateDevice = async (id: string | number, data: Omit<Partial<DeviceRaw>, '_id' | 'createdBy'>) => {
    try {
        const res = await instance.put(`${urlEndpoint}/${id}`, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const deleteDevice = async (id: string | number) => {
    try {
        const res = await instance.delete(`${urlEndpoint}/${id}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}