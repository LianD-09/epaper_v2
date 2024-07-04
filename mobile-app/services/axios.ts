import axios, { AxiosError, AxiosInstance } from 'axios';
import { getToken, removeToken } from './storage-services';
import { navigationRef } from '../navigation/root-navigation';

const API = process.env.EXPO_PUBLIC_API;
const API_ADHOC = process.env.EXPO_PUBLIC_API_ADHOC;

axios.defaults.headers.common['Accept'] = 'application/json';

const addInterceptor = (instant: AxiosInstance) => {

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
            const { status } = response;
            if (status === 401 || (status === 500 && !response.config.headers.Authorization)) {
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
        async (error) => {
            if (error.response?.status === 401) {
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
            // Handle error message
            if (error instanceof AxiosError) {
                let newError: AxiosError = new AxiosError(
                    error.message,
                    error.code,
                    error.config,
                    error.request,
                    error.response
                );

                const dataErr = error.response?.data;
                if (
                    dataErr &&
                    dataErr?.["message"] || dataErr?.["error"]
                ) {
                    if (!!dataErr["message"]) {
                        newError = new AxiosError(
                            dataErr["message"],
                            error.code,
                            error.config,
                            error.request,
                            error.response
                        );
                    }

                    if (!!dataErr["error"]) {
                        newError = new AxiosError(
                            dataErr["error"],
                            error.code,
                            error.config,
                            error.request,
                            error.response
                        );
                    }
                }
                return Promise.reject(newError);
            }
            else {
                return Promise.reject(
                    new AxiosError(
                        'Something was wrong!',
                        error.code,
                        error.config,
                        error.request,
                        error.response
                    )
                );
            }
            return Promise.reject(error);
        }
    )
    return instant;
}

const addInterceptorNonToken = (instant: AxiosInstance) => {

    instant.interceptors.response.use(
        async (response) => {
            return response;
        },
        async (error) => {
            // Handle error message
            if (error instanceof AxiosError) {
                let newError: AxiosError = new AxiosError(
                    error.message,
                    error.code,
                    error.config,
                    error.request,
                    error.response
                );

                const dataErr = error.response?.data;
                if (
                    dataErr &&
                    "message" in dataErr || "error" in dataErr
                ) {
                    if (!!dataErr["message"]) {
                        newError = new AxiosError(
                            dataErr["message"],
                            error.code,
                            error.config,
                            error.request,
                            error.response
                        );
                    }

                    if (!!dataErr["error"]) {
                        newError = new AxiosError(
                            dataErr["error"],
                            error.code,
                            error.config,
                            error.request,
                            error.response
                        );
                    }
                }
                return Promise.reject(newError);
            }
            return Promise.reject(error);
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

const createInstanceNonToken = (api) => {
    const instant = axios.create({
        baseURL: api,
    });

    addInterceptorNonToken(instant);

    return instant;
}

export const instanceToken = createInstance(API);

export const instanceNonToken = createInstanceNonToken(API);

export const instanceAdhoc = axios.create({
    baseURL: API_ADHOC,
    timeout: 10000,
    timeoutErrorMessage: 'Please check connected wifi network and try again'
});