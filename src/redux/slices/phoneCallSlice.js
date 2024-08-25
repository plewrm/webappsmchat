import { createSlice } from '@reduxjs/toolkit';

const phoneCallSlice = createSlice({
  name: 'call',
  initialState: {
    videoCall: false,
    audioCall: false
  },
  reducers: {
    setVideoCall: (state, action) => {
      state.videoCall = action.payload;
    },
    setAudioCall: (state, action) => {
      state.audioCall = action.payload;
    }
  }
});

export const { setVideoCall, setAudioCall } = phoneCallSlice.actions;
export default phoneCallSlice.reducer;
