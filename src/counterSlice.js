import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    adminValue: null,
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setAdminValue: (state, action) => {
            state.adminValue = action.payload
        },
    },
})

export const { setAdminValue } = counterSlice.actions

export default counterSlice.reducer