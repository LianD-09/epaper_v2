import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from './slice/loading-slice';
import bottomModalSlice from './slice/bottom-modal-slice';

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        bottomModal: bottomModalSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export type RootState = ReturnType<typeof store.getState>

export * from "./types"