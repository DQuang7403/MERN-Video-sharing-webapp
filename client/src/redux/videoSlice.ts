import { createSlice } from "@reduxjs/toolkit";
type VideoSlice = {
  currentVideo : null | {
    _id: string,
    views: number,
    title: string,
    description: string,
    videoUrl: string,
    thumbnailUrl: string,
    createdAt: string,
    updatedAt: string,
    userId: string,
    likes: string[],
    dislikes: string[],
    tags: string[],
  },
  loading: boolean,
  error: boolean,
}

const initialState : VideoSlice = {
  currentVideo: null,
  loading: false,
  error: false
}

export const VideoSlice = createSlice({
  name: "video",
  initialState,
  reducers:{
    fetchVideoStart: (state) =>{
      state.loading = true;
    },
    fetchVideoSuccess: (state, action) => {
      state.loading = false;
      state.error = false;
      state.currentVideo = action.payload
    },
    fetchVideoError: (state) =>{
      state.loading = false;
      state.error = true;
    },
    like:(state, action) =>{
      if(!state.currentVideo?.likes.includes(action.payload)){
        state.currentVideo?.likes.push(action.payload);
        state.currentVideo?.dislikes.splice(state.currentVideo.dislikes.findIndex(userId => userId === action.payload), 1);
      }else{
        state.currentVideo?.likes.splice(state.currentVideo.likes.findIndex(userId => userId === action.payload), 1);
      }
    },
    dislike: (state, action) =>{
      if(!state.currentVideo?.dislikes.includes(action.payload)){
        state.currentVideo?.dislikes.push(action.payload);
        state.currentVideo?.likes.splice(state.currentVideo.likes.findIndex(userId => userId === action.payload), 1);
      }else{
        state.currentVideo?.dislikes.splice(state.currentVideo.likes.findIndex(userId => userId === action.payload), 1);
      }
    }
  }
})

export const { fetchVideoStart, fetchVideoSuccess, fetchVideoError, like, dislike } = VideoSlice.actions;
export default VideoSlice.reducer;