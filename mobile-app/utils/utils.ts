import { decode, encode } from 'base-64';

export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const decodeValue = (value: string) => {
    return decode(value);
}

export const encodeValue = (value: string) => {
    return encode(value);
}