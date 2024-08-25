import { createSlice } from '@reduxjs/toolkit';

const sideBarSlices = createSlice({
  name: 'sideBar',
  initialState: {
    discoverTab: false
  },
  reducers: {
    setDiscoverTab: (state, action) => {
      state.discoverTab = action.payload;
      // console.log(state.discoverTab)
    }
  }
});

export const { setDiscoverTab } = sideBarSlices.actions;
export default sideBarSlices.reducer;
