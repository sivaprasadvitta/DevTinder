import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requests",
    initialState: [],
    reducers: {
        addRequests: (state, action) => {
            return action.payload;
        },
        removeRequests: (state, action) => {
            const newState = state.filter((r) => r._id !== action.payload);
            return newState;
        }
    }
});


export const { addRequests, removeRequests } = requestSlice.actions;
export default requestSlice.reducer;
