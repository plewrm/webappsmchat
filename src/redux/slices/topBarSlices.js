import { createSlice } from '@reduxjs/toolkit';

const topBarSlice = createSlice({
  name: 'topbar',
  initialState: {
    homeTab: true,
    postTab: false,
    messageTab: false,
    notificationTab: false,
    profileTab: false
  },
  reducers: {
    sethomeTab: (state) => {
      state.homeTab = !state.homeTab;
    },
    setpostTab: (state) => {
      state.postTab = !state.postTab;
    },
    setmessageTab: (state) => {
      state.messageTab = !state.messageTab;
    },
    setnotificationTab: (state) => {
      state.notificationTab = !state.notificationTab;
    }
  }
});

export const { sethomeTab, setpostTab, setmessageTab, setnotificationTab } = topBarSlice.actions;
export default topBarSlice.reducer;
