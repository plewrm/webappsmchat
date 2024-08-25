const ENCODING = 'binary';

export const buildLocalStorageKey = (walletAddress) =>
  walletAddress ? `xmtp:${'dev'}:keys:${walletAddress}` : '';

export const loadKeys = (walletAddress) => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  /* eslint-disable no-undef */
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress, keys) => {
  localStorage.setItem(buildLocalStorageKey(walletAddress), Buffer.from(keys).toString(ENCODING));
};

export const wipeKeys = (walletAddress) => {
  // This will clear the conversation cache + the private keys
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

export const getEnv = () => {
  return 'dev';
};
