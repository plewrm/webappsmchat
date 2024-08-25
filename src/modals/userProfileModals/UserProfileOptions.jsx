import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDeleteAccountModal, setLogoutAccountModal } from '../../redux/slices/modalSlice';
import axios from 'axios';
import { BASE_URL, DELETEACCOUNT, BEARER_TOKEN } from '../../api/EndPoint';
import '../UserProfile.css';
import { useNavigate } from 'react-router-dom';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings
} from '@web3auth/wallet-connect-v2-adapter';
import { WalletConnectModal } from '@walletconnect/modal';
import {
  clientId,
  walletConnectProjectId,
  chainConfig,
  useUiConfig,
  adapterSettings
} from '../../constants/web3auth';
import { clearMessageDb } from '../../xmtp/models/db';
import { useTheme } from '../../context/ThemeContext';

const UserProfileOptions = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const uiConfig = useUiConfig();
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [web3auth, setWeb3Auth] = useState(null);
  const deleteAccountModal = useSelector((state) => state.modal.deleteAccountModal);
  const logoutAccountModal = useSelector((state) => state.modal.logoutAccountModal);
  const { web3Auth } = useSelector((state) => state.auth);

  const closeDeleteConfirmation = () => {
    dispatch(setDeleteAccountModal(false));
  };
  const closelogoutConfirmation = () => {
    dispatch(setLogoutAccountModal(false));
  };

  const deleteAccount = async () => {
    try {
      const BEARER_TOKEN = sessionStorage.getItem('token');
      const privateKey = localStorage.getItem('socon-privatekey');

      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const body = {
        privateKey: privateKey
      };

      const response = await axios.post(`${BASE_URL}${DELETEACCOUNT}`, body, { headers });
      logout();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig }
        });

        const web3auth = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
          privateKeyProvider,
          uiConfig: uiConfig
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: adapterSettings,
          loginSettings: {
            mfaLevel: 'none'
          },
          privateKeyProvider
        });

        web3auth.configureAdapter(openloginAdapter);

        const defaultWcSettings = await getWalletConnectV2Settings(
          CHAIN_NAMESPACES.EIP155,
          ['0x1', '0xaa36a7'],
          walletConnectProjectId
        );
        const walletConnectModal = new WalletConnectModal({
          projectId: walletConnectProjectId
        });
        const walletConnectV2Adapter = new WalletConnectV2Adapter({
          adapterSettings: {
            qrcodeModal: walletConnectModal,
            ...defaultWcSettings.adapterSettings
          },
          loginSettings: { ...defaultWcSettings.loginSettings }
        });

        web3auth.configureAdapter(walletConnectV2Adapter);
        setWeb3Auth(web3auth);

        await web3auth.init();

        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const logout = async () => {
    await web3auth.logout();
    clearMessageDb();
    // dispatch(setLoggedIn(1))
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('soconId');
    // localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      {deleteAccountModal && (
        <div
          className={isDarkMode ? 'confirmationModalOverlay' : 'd-confirmationModalOverlay'}
          onClick={closeDeleteConfirmation}
        >
          <div
            className={isDarkMode ? 'confirmationModalContainer' : 'd-confirmationModalContainer'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmationTextContainer">
              <p className={isDarkMode ? 'confirmationText' : 'd-confirmationText'}>
                Are you sure you want to delete your account?
              </p>
            </div>
            <div className="confirmationsButtonCOntainer">
              <button
                className={isDarkMode ? 'cancelConfirmationButton' : 'd-cancelConfirmationButton'}
                onClick={closeDeleteConfirmation}
              >
                Cancel
              </button>
              <button
                className={isDarkMode ? 'confirmConfirmationButton' : 'd-confirmConfirmationButton'}
                onClick={deleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutAccountModal && (
        <div
          className={isDarkMode ? 'confirmationModalOverlay' : 'd-confirmationModalOverlay'}
          onClick={closelogoutConfirmation}
        >
          <div
            className={isDarkMode ? 'confirmationModalContainer' : 'd-confirmationModalContainer'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmationTextContainer">
              <p className={isDarkMode ? 'confirmationText' : 'd-confirmationText'}>
                Are you sure you want to logout your account?
              </p>
            </div>
            <div className="confirmationsButtonCOntainer">
              <button
                className={isDarkMode ? 'cancelConfirmationButton' : 'd-cancelConfirmationButton'}
                onClick={closelogoutConfirmation}
              >
                Cancel
              </button>
              <button
                className={isDarkMode ? 'confirmConfirmationButton' : 'd-confirmConfirmationButton'}
                onClick={logout}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileOptions;
