import { CHAIN_NAMESPACES } from '@web3auth/base';
import { useTheme } from '../context/ThemeContext';
import { useMemo } from 'react';

export const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
export const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const logourl =
  'https://socialcontinent.xyz/static/media/SOCON.decf3401e21291fc03f7a6a1e23cff64.svg';

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x1', // Please use 0x1 for Mainnet
  rpcTarget: 'https://rpc.ankr.com/eth',
  displayName: 'Ethereum Mainnet',
  blockExplorerUrl: 'https://etherscan.io/',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
};

export const useUiConfig = () => {
  const { isDarkMode } = useTheme();

  // Memoize the uiConfig to prevent unnecessary recalculations
  const uiConfig = useMemo(
    () => ({
      appName: 'SoCon',
      appUrl: 'https://socialcontinent.xyz',
      logoLight: logourl,
      logoDark: logourl,
      defaultLanguage: 'en',
      mode: isDarkMode ? 'light' : 'dark',
      theme: {
        primary: '#6e44ff'
      },
      useLogoLoader: true
    }),
    [isDarkMode]
  );

  return uiConfig;
};

// export const uiConfig = {
//     appName: "SoCon",
//     appUrl: "https://socialcontinent.xyz",
//     logoLight: "https://web3auth.io/images/web3authlog.png",
//     logoDark: "https://web3auth.io/images/web3authlogodark.png",
//     defaultLanguage: "en",
//     mode: "light",
//     theme: {
//       primary: "#6e44ff",
//     },
//     useLogoLoader: true,
// }

export const adapterSettings = {
  uxMode: 'redirect',
  mfaSettings: {
    deviceShareFactor: {
      enable: true,
      priority: 1,
      mandatory: false
    },
    backUpShareFactor: {
      enable: true,
      priority: 2,
      mandatory: false
    },
    socialBackupFactor: {
      enable: true,
      priority: 3,
      mandatory: false
    },
    passwordFactor: {
      enable: true,
      priority: 4,
      mandatory: false
    }
  }
};
