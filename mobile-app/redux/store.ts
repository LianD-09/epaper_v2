import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from './slice/loading-slice';
import bottomModalSlice from './slice/bottom-modal-slice';
import selectSlice from './slice/select-slice';
import datePickerSlice from './slice/date-picker-slice';

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        bottomModal: bottomModalSlice,
        select: selectSlice,
        datePicker: datePickerSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export type RootState = ReturnType<typeof store.getState>

export * from "./types"