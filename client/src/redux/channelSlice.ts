import { createSlice } from "@reduxjs/toolkit/react";

type ChannelSlice = {
  channel: null | {
    createdAt: string,
    _id: string,
    updatedAt: string,
    subscribers: number,
    subscribedUsers: string[],
    profileUrl: string,
    name: string,
    email: string,
    username: string,
  },
  subcribe: boolean,
  loading: boolean,
  error: boolean
  
}

const initialState : ChannelSlice = {
  channel: null,
  subcribe: false,
  loading: false,
  error: false
}


export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    fetchChannelStart: (state) =>{
      state.loading = true
    },
    fetchChannelSuccess: (state, action) =>{
      state.loading = false;
      state.channel = action.payload;
      state.error = false;
    },
    fetchChannelError: (state) =>{
      state.loading = false;
      state.error = true;
    },
    
  }
})
export const {fetchChannelStart, fetchChannelSuccess, fetchChannelError } = channelSlice.actions;
export default channelSlice.reducer;