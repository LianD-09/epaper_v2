import { DataRaw } from "../types/type";
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

export const createData = async (data: Omit<DataRaw, '_id' | 'createdBy'>) => {
    try {
        const res = await instance.post(`${urlEndpoint}`, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const updateData = async (id: string | number, data: Omit<Partial<DataRaw>, '_id' | 'createdBy'>) => {
    try {
        const res = await instance.put(`${urlEndpoint}/${id}`, data);
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