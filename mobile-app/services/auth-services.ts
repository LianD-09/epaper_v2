import { instanceNonToken } from "./axios";

const instance = instanceNonToken;

const urlLogin = instance.getUri() + '/user/login';
const urlSignup = instance.getUri() + '/user/register';


export const loginRequest = async (data: { email: string, password: string }) => {
    try {
        const res = await instance.post(urlLogin, data);
        return res;
    }
    catch (e) {
        // console.log(e);
        throw e;
    }
}

export const signupRequest = async (data: {
    email: string,
    password: string,
    name: string,
    gender: number
}) => {
    try {
        const res = await instance.post(urlSignup, data);
        return res;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}