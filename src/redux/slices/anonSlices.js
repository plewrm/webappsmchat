// anonSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addMemberApi, removeMemberApi, fetchCommunitiesApi } from '../../api/CommunityApi';

export const addMember = createAsyncThunk(
  'community/addMember',
  async ({ communityName, username }, { rejectWithValue }) => {
    try {
      const result = await addMemberApi(communityName, username);
      return { communityName, result };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeMember = createAsyncThunk(
  'community/removeMember',
  async ({ communityName, username }, { rejectWithValue }) => {
    try {
      const result = await removeMemberApi(communityName, username);
      return { communityName, result };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCommunities = createAsyncThunk(
  'community/fetchCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchCommunitiesApi();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const anonSlice = createSlice({
  name: 'community',
  initialState: {
    communityName: '',
    joinStatus: false,
    globalAnonPost: false,
    anonDetails: null,
    globalSpinBuzzState: false,
    globalAnonProfileUpdate: false,
    selectPost: null,
    onWait: false,
    communities: [],
    // loading: false,
    error: null,
    joinedCommunities: []
  },
  reducers: {
    setCommunityName: (state, action) => {
      state.communityName = action.payload;
    },
    setCommunityStatus: (state, action) => {
      state.joinStatus = action.payload;
    },
    setGlobalAnonPost: (state, action) => {
      state.globalAnonPost = action.payload;
    },
    setAnonDetails: (state, action) => {
      state.anonDetails = action.payload;
    },
    setGlobalSpinBuzzState: (state, action) => {
      state.globalSpinBuzzState = action.payload;
    },
    setGlobalAnonProfileUpdate: (state, action) => {
      state.globalAnonProfileUpdate = action.payload;
    },
    setSelectPost: (state, action) => {
      state.selectPost = action.payload;
    },
    setOnWait: (state, action) => {
      state.onWait = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMember.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        // state.loading = false;
        // state.joinStatus = true;
        state.joinedCommunities.push(action.payload.communityName);
      })
      .addCase(addMember.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeMember.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        // state.loading = false;
        // state.joinStatus = false;
        state.joinedCommunities = state.joinedCommunities.filter(
          (name) => name !== action.payload.communityName
        );
      })
      .addCase(removeMember.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCommunities.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        // state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCommunityName,
  setCommunityStatus,
  setGlobalAnonPost,
  setAnonDetails,
  setGlobalSpinBuzzState,
  setGlobalAnonProfileUpdate,
  setSelectPost,
  setOnWait
} = anonSlice.actions;

export default anonSlice.reducer;
