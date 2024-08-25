import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    xmtp: null,
    userProfile: null,
    privateKey: null,
    hideBug: false
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
      //console.log(action.payload)
    },
    setXmtp: (state, action) => {
      state.xmtp = action.payload;
      //console.log(action.payload)
    },
    setPrivateKey: (state, action) => {
      state.privateKey = action.payload;
      //console.log(action.payload)
    },
    setHideBug: (state, action) => {
      state.hideBug = action.payload;
    }
  }
});

export const { setUserProfile, setXmtp, setPrivateKey, setHideBug } = authSlice.actions;
export default authSlice.reducer;

// setWeb3Auth: (state, action) => {
//   console.log(action.payload)
//   state.web3Auth = action.payload;
//   // localStorage.setItem("web3", JSON.stringify(action.payload))
// },
// setUserProfile : (state, action) =>{
//   state.userProfile = action.userProfile;
// }
