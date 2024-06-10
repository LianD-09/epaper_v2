import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { BMState } from "../store";

const initialState: BMState = {
    isOpen: false,
    isFailed: false,
    title: "",
    icon: undefined,
    content: null,
    btnTitle: "",
    btnMores: [],
    btnCancelTitle: "",
    callback: null,
    backgroundPressable: true,
};

export const bottomModalSlice = createSlice({
    name: 'bottom-modal',
    initialState,
    reducers: {
        openBottomModal: (state, actions: PayloadAction<BMState>) => {
            return {
                ...state,
                ...actions.payload,
                isOpen: true,
            }
        },
        closeBottomModal: (state) => {
            return initialState;
        }
    }
})
// Action creators are generated for each case reducer function
export const { openBottomModal, closeBottomModal } = bottomModalSlice.actions

export default bottomModalSlice.reducer