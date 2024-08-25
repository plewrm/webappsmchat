import { createSlice } from '@reduxjs/toolkit';

const upcomingFeature = createSlice({
  name: 'upcomingFeature',
  initialState: {
    newFeatures: false
  },
  reducers: {
    setNewFeatures: (state, action) => {
      state.anonymousNotification = action.payload;
    }
  }
});

export const { setNewFeatures } = upcomingFeature.actions;
export default upcomingFeature.reducer;
