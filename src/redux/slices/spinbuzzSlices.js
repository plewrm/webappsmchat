import { createSlice } from '@reduxjs/toolkit';
const spinbuzzSlices = createSlice({
  name: 'spinbuzz',
  initialState: {
    spinbuzzNew: null,
    spinbuzzProfile: false,
    showCompatibility: false,
    showWhoopsieClock: false,
    showWhoopsieFailed: false,
    showWhoopsieWrapped: false,
    showSpinbuzzChat: false,
    timer: 1 * 600, // 10 minutes in seconds
    spinBuzzUser: null,
    lastIndex: 0,
    showSpinbuzzChatmsg: null,
    loadingProfile: false, // Add loading state property
    isAnimating: false,
    spinbuzzmessageData: [],

    spinBuzzUserAnon: null,
    spinMatchModal: false
  },
  reducers: {
    setSpinbuzzNew: (state, action) => {
      state.spinbuzzNew = action.payload;
    },

    setSpinbuzzProfile: (state, action) => {
      state.spinbuzzProfile = action.payload;
    },
    setShowCompatibility: (state, action) => {
      state.showCompatibility = action.payload;
    },
    setShowWhoopsieClock: (state, action) => {
      state.showWhoopsieClock = action.payload;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      }
    },
    resetTimer: (state) => {
      state.timer = 1 * 600; // Reset timer to 10 minutes
    },
    setShowWhoopsieFailed: (state, action) => {
      state.showWhoopsieFailed = action.payload;
    },
    setShowWhoopsieWrapped: (state, action) => {
      state.showWhoopsieWrapped = action.payload;
    },
    setShowSpinbuzzChat: (state, action) => {
      state.showSpinbuzzChat = action.payload;
    },
    setSpinBuzzUser: (state, action) => {
      state.spinBuzzUser = action.payload;
    },
    incrementListIndex: (state) => {
      state.lastIndex += 1;
    },
    setShowSpinbuzzChatMsg: (state, action) => {
      state.showSpinbuzzChatmsg = action.payload;
    },
    setLoadingProfile: (state, action) => {
      state.loadingProfile = action.payload;
    },

    setIsAnimating: (state, action) => {
      state.isAnimating = action.payload;
    },
    appendSpinbuzzMessageData: (state, action) => {
      // Assuming action.payload contains the new data to be appended
      const newData = action.payload;
      // Append the new data to the end of the array
      state.spinbuzzmessageData.push(newData);
    },
    setSpinbuzzMessageData: (state, action) => {
      // Assuming action.payload is an object with an index and new data
      const { index, newData } = action.payload;
      console.log(action.payload);
      // Replace the element at the specified index with the new data
      state.spinbuzzmessageData[index] = newData;
    },

    setSpinBuzzUserAnon: (state, action) => {
      state.spinBuzzUserAnon = action.payload;
    },
    setSpinMatchModal: (state, action) => {
      state.spinMatchModal = action.payload;
    }
  }
});
export const {
  setSpinbuzzNew,
  setSpinbuzzProfile,
  setShowCompatibility,
  setShowWhoopsieClock,
  decrementTimer,
  resetTimer,
  setShowWhoopsieFailed,
  setShowWhoopsieWrapped,
  setShowSpinbuzzChat,
  setSpinBuzzUser,
  incrementListIndex,
  setShowSpinbuzzChatMsg,
  setLoadingProfile,
  appendSpinbuzzMessageData,
  setSpinbuzzMessageData,
  setIsAnimating,
  setSpinBuzzUserAnon,
  setSpinMatchModal
} = spinbuzzSlices.actions;
export default spinbuzzSlices.reducer;
