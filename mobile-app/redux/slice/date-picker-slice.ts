import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { DatePickerState } from "../types";

const initialState: DatePickerState = {
    isOpen: false,
    startDate: null,
    endDate: null,
    label: '',
    selectedDate: null,
    selected: null,
    mode: 'date'
}
export const datePickerSlice = createSlice({
    name: 'date-picker',
    initialState,
    reducers: {
        openDateTimePickerModal: (state, action: PayloadAction<DatePickerState>) => {
            return {
                ...state,
                isOpen: true,
                startDate: action.payload?.startDate || null,
                endDate: action.payload?.endDate || null,
                label: '',
                selected: action.payload.selected,
                mode: action.payload.mode
            }
        },
        closeDateTimePickerModal: (state) => {
            return {
                ...state,
                isOpen: false,
            };
        },
        getSelectedDate: (state, action: PayloadAction<Date | null>): DatePickerState => {
            return {
                ...state,
                selectedDate: action.payload,
            }
        },
    }
})
// Action creators are generated for each case reducer function
export const { closeDateTimePickerModal, openDateTimePickerModal, getSelectedDate } = datePickerSlice.actions

export default datePickerSlice.reducer