import { createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
    name:'feed',
    initialState:[],
    reducers:{
        addFeed:(state,action)=>{
            return action.payload
        },
        removeUserFromFeed:(state,action)=>{
            const newFeed = state.filter(user => user._id !== action.payload)
            return newFeed
        },
        removeFeed:(state,action)=>{
            return []
        }

    }
})
export const {addFeed,removeUserFromFeed,removeFeed} = feedSlice.actions
export default feedSlice.reducer