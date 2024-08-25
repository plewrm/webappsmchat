import { createSlice } from '@reduxjs/toolkit';

const mobileActionSlices = createSlice({
  name: 'mobileActions',
  initialState: {
    isMobile: false,
    mobileChats: null,
    hideAllMsg: false,
    messageMobile: false,
    anonMessageMobile: false
  },
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
      // console.log("modal",action.payload)
    },
    setMobileChats: (state, action) => {
      state.mobileChats = action.payload;
    },
    setHideAllMsg: (state, action) => {
      state.hideAllMsg = action.payload;
      // console.log("hide msg",action.payload)
    },
    setMessageMobile: (state, action) => {
      state.messageMobile = action.payload;
    },
    setAnonMessageMobile: (state, action) => {
      state.anonMessageMobile = action.payload;
    }
  }
});

export const {
  setIsMobile,
  setMobileChats,
  setHideAllMsg,
  setMessageMobile,
  setAnonMessageMobile
} = mobileActionSlices.actions;
export default mobileActionSlices.reducer;
