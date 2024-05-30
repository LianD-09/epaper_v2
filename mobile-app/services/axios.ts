import axios from 'axios';
import { getToken, removeToken } from './storage-services';
import { navigationRef } from '../navigation/root-navigation';

const API = process.env.EXPO_PUBLIC_API;
const API_ADHOC = process.env.EXPO_PUBLIC_API_ADHOC;

axios.defaults.headers.common['Accept'] = 'application/json';

const addInterceptor = (instant) => {

    instant.interceptors.request.use(
        async (config) => {
            if (!config?.headers?.Authorization) {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    config.headers.Authorization = '';
                }
            }
            return config;
        },
        (err) => Promise.reject(err),
    );

    instant.interceptors.response.use(
        async (response) => {
            const { code } = response;
            if (code === 401 || (code === 500 && !response.config.headers.Authorization)) {
                await removeToken();
                navigationRef.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Sign-in'
                        },
                    ]
                });
            }
            return response;
        },
        async (err) => {
            if (err.response?.status === 401) {
                await removeToken();
                navigationRef.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Sign-in'
                        },
                    ]
                });
            }
            return Promise.reject(err);
        }
    )
    return instant;
}

const createInstance = (api) => {
    const instant = axios.create({
        baseURL: api,
    });

    addInterceptor(instant);

    return instant;
}

export const instanceToken = createInstance(API);

export const instanceNonToken = axios.create({
    baseURL: API,
});

export const instanceAdhoc = axios.create({
    baseURL: API_ADHOC,
});