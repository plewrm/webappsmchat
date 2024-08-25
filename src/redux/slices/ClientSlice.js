import { createSlice } from '@reduxjs/toolkit';
import { Client } from '@xmtp/react-sdk';
import { AttachmentCodec, RemoteAttachmentCodec } from '@xmtp/content-type-remote-attachment';
import { ReplyCodec } from '@xmtp/content-type-reply';
import { ReactionCodec } from '@xmtp/content-type-reaction';
import { ReadReceiptCodec } from '@xmtp/content-type-read-receipt';
// Get the keys using a valid Signer. Save them somewhere secure.
import { loadKeys, storeKeys, getEnv, wipeKeys } from '../../components/calling/getxmtpKeys';
// import { ContentTypeVideoCallCodec } from "../types/xmtp-content-type-video-call";
import { ContentTypeSharePostCodec } from '../../xmtp/codecs/PostShareCodec';

const initialState = {
  client: null,
  isLoading: true
};

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearClient: (state) => {
      state.client = null;
      state.isLoading = true;
    }
  }
});

export const { setClient, setLoading, clearClient } = clientSlice.actions;

export const createClient = (address, signer) => async (dispatch) => {
  console.log('creating client');
  const options = {
    env: getEnv(),
    skipContactPublishing: true,
    persistConversations: false
  };

  let keys = loadKeys(address);
  if (!keys) {
    keys = await Client.getKeys(signer, options);
    storeKeys(address, keys);
  }

  /* eslint-disable no-undef */
  const c = await initialize({ keys, options, signer });
  if (c) {
    c.registerCodec(new AttachmentCodec());
    c.registerCodec(new RemoteAttachmentCodec());
    // c.registerCodec(new ContentTypeVideoCallCodec());
    c.registerCodec(new ReplyCodec());
    c.registerCodec(new ReactionCodec());
    c.registerCodec(new ReadReceiptCodec());
    c.registerCodec(new ContentTypeSharePostCodec());
    dispatch(setClient(c));
  }

  dispatch(setLoading(false));
};

export const disconnectClient = (address) => (dispatch) => {
  wipeKeys(address);
  dispatch(clearClient());
};

export const selectClient = (state) => state.client.client;
export const selectLoading = (state) => state.client.isLoading;

export default clientSlice.reducer;
