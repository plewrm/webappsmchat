import { createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

const initialState = {
  address: '',
  signer: null
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setSigner: (state, action) => {
      state.signer = action.payload;
    },
    clearWallet: (state) => {
      state.address = '';
      state.signer = null;
    }
  }
});

export const { setAddress, setSigner, clearWallet } = walletSlice.actions;

export const connectWallet = () => async (dispatch) => {
  console.log('in connect wallet');

  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Get MetaMask!');
      return;
    }
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    });
    console.log('walletAddress Print', accounts[0]);
    dispatch(setAddress(accounts[0]));
    const provider = new ethers.BrowserProvider(ethereum);
    const currentSigner = await provider.getSigner();
    dispatch(setSigner(currentSigner));
  } catch (err) {
    console.error(err);
  }
};

export const disconnectWallet = () => async (dispatch) => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('No ethereum object found.');
      return;
    }
    //await ethereum.request({ method: "eth_logout" });
    dispatch(clearWallet());
  } catch (err) {
    console.error(err);
  }
};

export const checkIfWalletIsConnected = () => async (dispatch) => {
  console.log('hello');
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure you have metamask!');
      alert('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      dispatch(setAddress(account));
      const provider = new ethers.BrowserProvider(ethereum);
      const currentSigner = await provider.getSigner();
      dispatch(setSigner(currentSigner));
      ethereum.on('accountsChanged', () => {
        dispatch(checkIfWalletIsConnected());
      });
      ethereum.on('chainChanged', () => {
        dispatch(checkIfWalletIsConnected());
      });
    } else {
      console.log('No authorized account found');
    }
  } catch (err) {
    console.error(err);
  }
};

export const selectAddress = (state) => state.wallet.address;
export const selectSigner = (state) => state.wallet.signer;

export default walletSlice.reducer;
