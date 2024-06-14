import { createSlice } from "@reduxjs/toolkit";

type UserSlice = {
  currentUser: null | { 
    _id: string,
    username: string,
    name: string, 
    email: string, 
    profileUrl: string, 
    subscribers: number, 
    subscribedUsers: { 
      id: string,
      name: string, 
      profileUrl: string, 
      username: string,
    }[],
  },
  token: string,
  loading: boolean,
  error: boolean

}

const initialState: UserSlice = {
  currentUser: null,
  token: "",
  loading: false,
  error: false
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers:{
    loginStart: (state) =>{
      state.loading = true;
    },
    setAuth: (state, action) =>{
      state.loading = true;
      state.token = action.payload.access_token
      state.currentUser = action.payload.user_info
    },
    loginFailure: (state) =>{
      state.loading = true;
      state.error = true;
      
    },
    logout: () =>{
      return initialState;
    },
    subcribe: (state, action) => {
      if (state.currentUser && state.currentUser.subscribedUsers.filter(user => user.id === action.payload.id).length > 0) {
        state.currentUser.subscribedUsers.splice(state.currentUser.subscribedUsers.findIndex(user => user.id === action.payload.id), 1);
      } else {
        if (state.currentUser) {
          state.currentUser.subscribedUsers.push(action.payload);
        }
      }
    }
  }
})


export const { loginStart, setAuth, loginFailure, logout, subcribe } = userSlice.actions;
export default userSlice.reducer