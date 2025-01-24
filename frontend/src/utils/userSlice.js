import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: null, // Change this to an empty array
    reducers: {
        addUser: (state, action) => {
            return [action.payload]; // Wrap payload in an array
        },
        removeUser: (state, action) => {
            return [];
        }
    }
});


export const {addUser,removeUser} = userSlice.actions
export default userSlice.reducer