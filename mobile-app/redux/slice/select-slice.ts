import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SelectItem, SelectState } from "../types"

const initialState: SelectState = {
    isOpen: false,
    items: [],
    label: '',
    selectedItem: null,
    selected: null,
    mode: ''
}
export const selectSlice = createSlice({
    name: 'select',
    initialState,
    reducers: {
        openSelect: (state, action: PayloadAction<SelectState>) => {
            return {
                ...state,
                isOpen: true,
                items: action.payload.items,
                label: action.payload.label,
                selected: action.payload.selected,
                mode: action.payload.mode
            }
        },
        closeSelect: (state) => {
            return {
                ...state,
                isOpen: false,
                items: [],
            }
        },
        getSelectedItem: (state, action: PayloadAction<SelectItem | null>) => {
            return {
                ...state,
                selectedItem: action.payload,
            }
        },
        resetSelectedItem: (state) => {
            return {
                ...state,
                selectedItem: null,
            }
        }
    }
})
// Action creators are generated for each case reducer function
export const { openSelect, closeSelect, getSelectedItem, resetSelectedItem } = selectSlice.actions

export default selectSlice.reducer