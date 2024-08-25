import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import modalReducer from '../slices/modalSlice';
import messageTabsSlices from '../slices/messageTabsSlices';
import topBarSlice from '../slices/topBarSlices';
import mobileActionSlice from '../slices/mobileActionSlices';
import sideBarSlices from '../slices/sideBarSlices';
import anonSlice from '../slices/anonSlices';
import anonViewSlice from '../slices/anonViewSlice'; // Import the anonViewSlice
import postSlices from '../slices/postSlices';
import authSlice from '../slices/authSlice';
import chatSlice from '../slices/chatSlice';
import loaderSlice from '../slices/loaderSlice';
import loggedInSlice from '../slices/loggedInSlice';
import spinbuzzSlices from '../slices/spinbuzzSlices';
import phoneCallSlice from '../slices/phoneCallSlice';
import WalletSlice from '../slices/WalletSlice';
import ClientSlice from '../slices/ClientSlice';
// Combine your reducers into a root reducer
const rootReducer = combineReducers({
  modal: modalReducer,
  tabs: messageTabsSlices,
  topbar: topBarSlice,
  mobileActions: mobileActionSlice,
  sideBar: sideBarSlices,
  posts: postSlices,
  community: anonSlice,
  auth: authSlice,
  chat: chatSlice,
  loader: loaderSlice,
  anonView: anonViewSlice, // Add the anonViewSlice reducer
  loginView: loggedInSlice,
  spinbuzz: spinbuzzSlices,
  call: phoneCallSlice,
  wallet: WalletSlice,
  client: ClientSlice
});

// Configuration for Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['anonView', 'loginView'] // Specify which parts of state to persist (in this case, only the anonViewSlice)
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer
});

// Create a persistor object to persist the store
export const persistor = persistStore(store);

// import { configureStore } from '@reduxjs/toolkit';
// import modalReducer from '../slices/modalSlice';
// import messageTabsSlices from '../slices/messageTabsSlices';
// import topBarSlice from '../slices/topBarSlices';
// import mobileActionSlice from '../slices/mobileActionSlices'
// import sideBarSlices from '../slices/sideBarSlices';
// import anonSlice from '../slices/anonSlices'
// import postSlices from '../slices/postSlices';
// import authSlice from '../slices/authSlice';
// import chatSlice from '../slices/chatSlice'
// import loaderSlice from '../slices/loaderSlice'
// export const store = configureStore({
//   reducer: {
//     modal: modalReducer,
//     tabs: messageTabsSlices,
//     topbar: topBarSlice,
//     mobileActions: mobileActionSlice,
//     sideBar : sideBarSlices,
//     posts : postSlices,
//     community : anonSlice,
//     auth : authSlice,
//     chat : chatSlice,
//     loader : loaderSlice
//   },
// });

// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

// import modalReducer from '../slices/modalSlice';
// import messageTabsSlices from '../slices/messageTabsSlices';
// import topBarSlice from '../slices/topBarSlices';
// import mobileActionSlice from '../slices/mobileActionSlices';
// import sideBarSlices from '../slices/sideBarSlices';
// import anonSlice from '../slices/anonSlices';
// import postSlices from '../slices/postSlices';
// import authSlice from '../slices/authSlice';
// import chatSlice from '../slices/chatSlice';

// // Create a persistConfig for authSlice
// const authPersistConfig = {
//   key: 'auth',
//   storage,
//   // Add any specific configuration options here
//   // For example, you can blacklist certain keys if needed
//   // blacklist: ['blacklistedKey'],
// };

// // Create a persisted reducer for authSlice
// const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

// export const store = configureStore({
//   reducer: {
//     modal: modalReducer,
//     tabs: messageTabsSlices,
//     topbar: topBarSlice,
//     mobileActions: mobileActionSlice,
//     sideBar: sideBarSlices,
//     posts: postSlices,
//     community: anonSlice,
//     auth: persistedAuthReducer, // Use the persisted reducer for authSlice
//     chat: chatSlice,
//   },
// });

// // Create a persisted store
// export const persistor = persistStore(store);
