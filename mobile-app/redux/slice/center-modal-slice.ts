import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { CMState } from "../store";

const initialState: CMState = {
    isOpen: false,
    isFailed: false,
    title: "",
    icon: undefined,
    content: null,
    btnTitle: "",
    btnCancelTitle: "",
    callback: null,
};

export const centerModalSlice = createSlice({
    name: 'center-modal',
    initialState,
    reducers: {
        openCenterModal: (state, actions: PayloadAction<CMState>) => {
            return {
                ...state,
                ...actions.payload,
                isOpen: true,
            }
        },
        closeCenterModal: (state) => {
            return initialState;
        }
    }
})
// Action creators are generated for each case reducer function
export const { openCenterModal, closeCenterModal } = centerModalSlice.actions

export default centerModalSlice.reducer