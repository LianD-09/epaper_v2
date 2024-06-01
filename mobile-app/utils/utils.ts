import { encode as base64Encode, decode as base64Decode } from 'base-64';
import { encode as utf8Encode, decode as utf8Decode } from 'utf8';
import { getToken } from '../services/storage-services';
import { AxiosError } from 'axios';

// Hàm mã hóa chuỗi tiếng Việt sang base64
export const encodeValue = (input) => {
    const utf8Bytes = utf8Encode(input);
    const base64String = base64Encode(utf8Bytes);
    return base64String;
};

// Hàm giải mã chuỗi base64 sang chuỗi tiếng Việt
export const decodeValue = (input) => {
    const utf8Bytes = base64Decode(input);
    const originalString = utf8Decode(utf8Bytes);
    return originalString;
};

export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const validateToken = async () => {
    const token = await getToken();

    if (!!!token) return false;

    const payload = token.split(".")[1];
    const decodedToken = base64Decode(payload);
    const { exp } = JSON.parse(decodedToken);
    return Date.now() <= exp * 1000;
}