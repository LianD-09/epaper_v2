import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { UserState } from "../store";

const initialState: UserState = {
    isLogin: false,
    data: {
        id: '',
        email: '',
        name: '',
        gender: 0,
        createdAt: '',
        updatedAt: '',
    }
};

export const userSlice = createSlice({
    name: 'bottom-modal',
    initialState,
    reducers: {
        loginUser: (state, actions: PayloadAction<UserState>) => {
            return {
                data: actions.payload.data,
                isLogin: true,
            }
        },
        updateUser: (state, actions: PayloadAction<UserState>) => {
            return {
                ...state,
                ...actions.payload,
            }
        },
        removeUser: (state) => {
            return initialState;
        }
    }
})
// Action creators are generated for each case reducer function
export const { loginUser, updateUser, removeUser } = userSlice.actions

export default userSlice.reducer;