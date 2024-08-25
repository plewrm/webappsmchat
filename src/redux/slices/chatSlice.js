import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messageData: [],
    postLink: '',
    expanded: false,
    conversation: {},
    anonymousExpanded: false
  },
  reducers: {
    setConversation: (state, action) => {
      // Assuming action.payload is an array of data
      state.conversation = action.payload;
    },
    setMessageData: (state, action) => {
      // Assuming action.payload is an object with an index and new data
      const { index, newData } = action.payload;
      console.log(action.payload);
      // Replace the element at the specified index with the new data
      state.messageData[index] = newData;
    },
    appendMessageData: (state, action) => {
      // Assuming action.payload contains the new data to be appended
      const newData = action.payload;
      // Append the new data to the end of the array
      state.messageData.push(newData);
    },
    setPostLink: (state, action) => {
      state.postLink = action.payload;
    },
    toggleExpand: (state) => {
      state.expanded = !state.expanded;
    },
    setAnonymousExpanded: (state) => {
      state.anonymousExpanded = !state.anonymousExpanded;
    }
  }
});

export const {
  setMessageData,
  appendMessageData,
  setConversation,
  setPostLink,
  toggleExpand,
  setAnonymousExpanded
} = chatSlice.actions;
export default chatSlice.reducer;
