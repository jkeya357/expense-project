import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {token: null, email: null, id: null},
    reducers: {
        SetCredentials: (state, action) => {
            const {accessToken, email, user} = action.payload
            state.token = accessToken
            state.email = email
            state.id = user
        },
        logout: (state, action) => {
            state.token = null
            state.email = null
            state.id = null
        }
    }
})

export const {SetCredentials, logout} = authSlice.actions
 
export default  authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentEmail = (state) => state.auth.email
export const selectCurrentUserId = (state) => state.auth.id