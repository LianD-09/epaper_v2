import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from './slice/loadingSlice';

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});