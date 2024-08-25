import { createSlice } from '@reduxjs/toolkit';

const loggedInSlice = createSlice({
  name: 'loginView',
  initialState: {
    logged: 1
  },
  reducers: {
    setLogged: (state, action) => {
      state.logged = action.payload;
    }
  }
});

export const { setLogged } = loggedInSlice.actions;
export default loggedInSlice.reducer;
