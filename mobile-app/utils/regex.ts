export const validateName = (name: string) => {
    return RegExp(/^[\w\-\. ]+$/, 'g').test(name);
}

export const validateWifiPass = (name: string) => {
    return RegExp(/^.{8,}$/, 'g').test(name);
}

export const validateSSID = (name: string) => {
    return RegExp(/^.+$/, 'g').test(name);
}