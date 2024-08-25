import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFollowingUsersApi, followUserApi, unfollowUserApi } from '../../api/FollowingApi';
// import { followUserApi, unfollowUserApi } from '../../api/FollowUnfollowUserApi';

// Async thunk for fetching following users
export const fetchFollowingUsers = createAsyncThunk(
  'posts/fetchFollowingUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await fetchFollowingUsersApi();
      return users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for following a user
export const followUser = createAsyncThunk(
  'posts/followUser',
  async (authorSoconId, { rejectWithValue }) => {
    try {
      const result = await followUserApi(authorSoconId);
      return result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for unfollowing a user
export const unfollowUser = createAsyncThunk(
  'posts/unfollowUser',
  async (authorSoconId, { rejectWithValue }) => {
    try {
      const result = await unfollowUserApi(authorSoconId);
      return result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    status: 'idle',
    error: null,
    mentionData: [],
    comment: '',
    followingUsers: []
  },
  reducers: {
    setComment: (state, action) => {
      state.comment = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowingUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFollowingUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.mentionData = action.payload;
        state.followingUsers = action.payload.map((user) => user.soconId);
      })
      .addCase(fetchFollowingUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { authorSoconId } = action.payload;
        state.followingUsers.push(authorSoconId);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { authorSoconId } = action.payload;
        state.followingUsers = state.followingUsers.filter((soconId) => soconId !== authorSoconId);
      });
  }
});

export const { setComment } = postsSlice.actions;
export default postsSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import API_ENDPOINTS from '../../apiConfig';

// // Async thunk for creating a post
// export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
//   const response = await axios.post(API_ENDPOINTS.createPost, postData);
//   return response.data;
// });

// const postsSlice = createSlice({
//   name: 'posts',
//   initialState: {
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createPost.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(createPost.fulfilled, (state) => {
//         state.status = 'succeeded';
//       })
//       .addCase(createPost.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export default postsSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const postsSlice = createSlice({
//   name: 'posts',
//   initialState: { comment: '' },
//   reducers: {
//     setComment: (state, action) => {
//       state.comment = action.payload;
//     }
//   }
// });

// export const { setComment } = postsSlice.actions;
// export default postsSlice.reducer;
