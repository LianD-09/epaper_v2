import { DataDto } from "../types/type";
import { instanceToken } from "./axios";

const instance = instanceToken;

const urlEndpoint = instance.getUri() + '/data';


export const getAllData = async () => {
    try {
        const res = await instance.get(`${urlEndpoint}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const getDataById = async (id: string | number) => {
    try {
        const res = await instance.get(`${urlEndpoint}/${id}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const createDataNoMqtt = async (data: Omit<DataDto, '_id' | 'createdBy'>) => {
    try {
        const res = await instance.post(`${urlEndpoint}/n`, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const updateData = async (id: string | number, data: Omit<Partial<DataDto>, '_id' | 'createdBy'>) => {
    try {
        const res = await instance.put(`${urlEndpoint}/${id}`, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const updateDataNoMqtt = async (id: string | number, data: Omit<Partial<DataDto>, '_id' | 'createdBy' | 'deviceID' | 'deviceName'>) => {
    try {
        const res = await instance.put(`${urlEndpoint}/n/${id}`, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const deleteData = async (id: string | number) => {
    try {
        const res = await instance.delete(`${urlEndpoint}/${id}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}