import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';

export const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
        console.log(e);
    }
};

export const getToken = async () => {
    try {
        const value = await AsyncStorage.getItem(TOKEN_KEY);
        return value;
    } catch (e) {
        console.log(e);
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
        console.log(e);
    }
};