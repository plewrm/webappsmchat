import { createSlice } from '@reduxjs/toolkit';

const messageTabsSlices = createSlice({
  name: 'tabs',
  initialState: {
    activeTab: 1,
    suggestedActiveTab: false
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSuggestedActiveTab: (state, action) => {
      state.suggestedActiveTab = action.payload;
    }
  }
});

export const { setActiveTab, setSuggestedActiveTab } = messageTabsSlices.actions;
export const selectActiveTab = (state) => state.tabs.activeTab;
export default messageTabsSlices.reducer;
