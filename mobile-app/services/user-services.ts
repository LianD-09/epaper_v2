import { UserRaw } from "../types/type";
import { instanceToken } from "./axios";

const instance = instanceToken;

const urlEndpoint = instance.getUri() + '/user';


export const getProfile = async (id: string | number) => {
    try {
        const res = await instance.get(`${urlEndpoint}/${id}`);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const updateProfile = async (id: string | number, data: Omit<Partial<UserRaw>, '_id'>) => {
    try {
        const res = await instance.put(`${urlEndpoint}/${id}`, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}