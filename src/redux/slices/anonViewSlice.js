import { createSlice } from '@reduxjs/toolkit';

const anonViewSlice = createSlice({
  name: 'anonView',
  initialState: {
    anonymousView: false
  },
  reducers: {
    setAnonymousView: (state, action) => {
      state.anonymousView = action.payload;
    }
  }
});

export const { setAnonymousView } = anonViewSlice.actions;
export default anonViewSlice.reducer;
