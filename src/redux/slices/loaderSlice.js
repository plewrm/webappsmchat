import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    postLoader: false,
    globalPostState: false,
    globalStoryState: false,
    anonLoader: false,
    globalProfileState: false,
    responseLoader: false
  },
  reducers: {
    setPostLoader: (state, action) => {
      state.postLoader = action.payload;
    },
    setGlobalPostState: (state, action) => {
      state.globalPostState = action.payload;
    },
    setGlobalStoryState: (state, action) => {
      state.globalStoryState = action.payload;
    },
    setAnonLoader: (state, action) => {
      state.anonLoader = action.payload;
    },
    setGlobalProfileState: (state, action) => {
      state.globalProfileState = action.payload;
      // console.log(action.payload);
    },
    setResponseLoader: (state, action) => {
      state.responseLoader = action.payload;
      console.log(action.payload);
    }
  }
});

export const {
  setPostLoader,
  setGlobalPostState,
  setGlobalStoryState,
  setAnonLoader,
  setGlobalProfileState,
  setResponseLoader
} = loaderSlice.actions;
export default loaderSlice.reducer;
