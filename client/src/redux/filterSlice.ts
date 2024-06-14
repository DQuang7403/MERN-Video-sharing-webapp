import { createSlice } from "@reduxjs/toolkit";

type FilterSlice = {
  loading: boolean;
  error: boolean;
  tag: string;
}

const initialState : FilterSlice = {
  loading: false,
  error: false,
  tag: ""
}

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action) =>{
      state.loading = true;
      state.tag = action.payload;
      state.error = false;
    }
  }
})

export const {setFilter} = filterSlice.actions
export default filterSlice.reducer