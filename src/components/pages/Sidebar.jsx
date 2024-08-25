import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserProfile } from '../../redux/slices/authSlice';
import { openCreatePostModal } from '../../redux/slices/modalSlice';
import { setAnonLoader } from '../../redux/slices/loaderSlice';
import { setAnonDetails } from '../../redux/slices/anonSlices';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import { toggleExpand } from '../../redux/slices/chatSlice';
import { setResponseLoader } from '../../redux/slices/loaderSlice';
import { clearMessageDb } from '../../xmtp/models/db';
import { setSpinbuzzNew } from '../../redux/slices/spinbuzzSlices';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
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
  adapterSettings,
  useUiConfig
} from '../../constants/web3auth';
import { setAnonymousView } from '../../redux/slices/anonViewSlice';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETANON,
  GETPROFILE,
  retrievedSoconId,
  NOTIFICATIONSCOUNT
} from '../../api/EndPoint';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uiConfig = useUiConfig();
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const [userDetails, setUserDetails] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isOn, setIsOn] = useState(false);

  const handleSpinbuzz = () => {
    dispatch(setSpinbuzzNew(true));
  };
  const handleHome = () => {
    navigate('/homepage');
  };
  const handleDiscover = () => {
    navigate('/discovers');
  };
  const handleMessages = () => {
    navigate('/messages');
  };
  const handleNotifications = () => {
    navigate('/notifications');
  };
  const handleProfile = () => {
    navigate(`/profile/${userDetails.username}/${userDetails.soconId}`, {
      state: { soconId: userDetails.soconId }
    });
  };
  const handlePost = () => {
    dispatch(openCreatePostModal());
  };

  //web3auth
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

  useEffect(() => {
    if (!localStorage.getItem('token') || !localStorage.getItem('soconId')) {
      navigate('/');
    }
  }, [navigate]);

  const globalProfileState = useSelector((state) => state.loader.globalProfileState);

  const logout = async () => {
    web3auth.logout();
    clearMessageDb();
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('soconId');
    navigate('/');
  };

  const toggleAnonymousView = async () => {
    dispatch(setResponseLoader(true));
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${GETANON}`, { headers });
      console.log(response.data);
      if (response.data.message === 'Success') {
        dispatch(setResponseLoader(false));
        dispatch(setAnonDetails(response.data.data));
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch(setAnonLoader(false));
    }
    dispatch(setResponseLoader(false));
    dispatch(setAnonLoader(true));
    setIsOn(true);
    dispatch(setAnonymousView(true));
    navigate('/anon/homepage');
  };

  const getUserProfileDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      // will replace 10 with actual socon id
      const response = await axios.get(
        `${BASE_URL}${GETPROFILE}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );
      // console.log(response.data)
      setUserDetails(response.data.profile);
      dispatch(setUserProfile(response.data.profile));
    } catch (error) {
      if (error.response.data.message === 'Unauthorized, token either not right or expired.') {
        logout();
      }
    }
  };

  const [notificationCount, setNotificationCount] = useState(0);
  const getNotificationCount = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      // will replace 10 with actual socon id
      const response = await axios.get(`${BASE_URL}${NOTIFICATIONSCOUNT}`, { headers });
      // console.log(response.data)
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserProfileDetails();
    getNotificationCount();
  }, [globalProfileState]);

  const isProfilePage =
    location.pathname === `/profile/${userDetails?.username}/${userDetails?.soconId}`;

  return (
    <div className={isDarkMode ? 'sideBarContainer' : 'd-sideBarContainer'}>
      <div className="soconsideIconContainer">
        <img src="/sidebar/socon.svg" className="soconSideIcon" />
      </div>

      <div className="toggle-container">
        <div
          className={`toggle-switch ${isOn ? 'toggle-switch-on' : 'toggle-switch-off'}`}
          onClick={toggleAnonymousView}
        >
          <div className={`toggle-circle ${isOn ? 'toggle-on' : 'toggle-off'}`}>
            <img
              src={isOn ? '/sidebar/toggleProfile.svg' : '/sidebar/toggle.svg'}
              alt="Toggle circle"
            />
          </div>
        </div>
      </div>

      <div
        className={isDarkMode ? 'sideSpinbuzzContainer' : 'd-sideSpinbuzzContainer'}
        onClick={handleSpinbuzz}
      >
        <div className="sideSpinbuzzImageContainer">
          <img src="/sidebar/spinbuzz.svg" className="sideSpinbuzzImage" />
        </div>
        <div className="menuTextContainer">
          <p className={isDarkMode ? 'menuText' : 'd-menuText'}>Spinbuzz</p>
        </div>
      </div>

      <div
        className={isDarkMode ? 'sideMenuContainer' : 'd-sideMenuContainer'}
        onClick={handleHome}
      >
        <div className="sideMenuImageContainer">
          {['/homepage'].includes(location.pathname) ? (
            <img src="/sidebar/selectedHome.svg" className="sidehomeImage" />
          ) : (
            <img
              src={isDarkMode ? '/sidebar/homeLight.svg' : '/sidebar/home.svg'}
              className="sidehomeImage"
            />
          )}
        </div>
        {['/homepage'].includes(location.pathname) ? (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuTextActive' : 'd-menuTextActive'}>Home</p>
          </div>
        ) : (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuText' : 'd-menuText'}>Home</p>
          </div>
        )}
      </div>

      <div
        className={isDarkMode ? 'sideMenuContainer' : 'd-sideMenuContainer'}
        onClick={handleDiscover}
      >
        <div className="sideMenuImageContainer">
          {['/discovers'].includes(location.pathname) ? (
            <img src="/sidebar/selectedDiscover.svg" className="sidehomeImage" />
          ) : (
            <img
              src={isDarkMode ? '/sidebar/discoverLight.svg' : '/sidebar/discover.svg'}
              className="sidehomeImage"
            />
          )}
        </div>
        {['/discovers'].includes(location.pathname) ? (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuTextActive' : 'd-menuTextActive'}>Discover</p>
          </div>
        ) : (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuText' : 'd-menuText'}>Discover</p>
          </div>
        )}
      </div>

      <div
        className={isDarkMode ? 'sideMenuContainer' : 'd-sideMenuContainer'}
        onClick={handleMessages}
      >
        <div className="sideMenuImageContainer">
          {['/messages'].includes(location.pathname) ? (
            <img src="/sidebar/selectedMessages.svg" className="sidehomeImage" />
          ) : (
            <img
              src={isDarkMode ? '/sidebar/messagesLight.svg' : '/sidebar/messages.svg'}
              className="sidehomeImage"
            />
          )}
        </div>
        {['/messages'].includes(location.pathname) ? (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuTextActive' : 'd-menuTextActive'}>Messages</p>
          </div>
        ) : (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuText' : 'd-menuText'}>Messages</p>
          </div>
        )}
      </div>

      <div
        className={isDarkMode ? 'sideMenuContainer' : 'd-sideMenuContainer'}
        onClick={handleNotifications}
      >
        <div className="sideMenuImageContainer" style={{ position: 'relative' }}>
          <div className="notificationCountBox">
            <p className="notificationCountText">{notificationCount}</p>
          </div>
          {['/notifications'].includes(location.pathname) ? (
            <img src="/sidebar/selectedNotification.svg" className="sidehomeImage" />
          ) : (
            <img
              src={isDarkMode ? '/sidebar/notificationLight.svg' : '/sidebar/notification.svg'}
              className="sidehomeImage"
            />
          )}
        </div>
        {['/notifications'].includes(location.pathname) ? (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuTextActive' : 'd-menuTextActive'}>Notifications</p>
          </div>
        ) : (
          <div className="menuTextContainer">
            <p className={isDarkMode ? 'menuText' : 'd-menuText'}>Notifications</p>
          </div>
        )}
      </div>

      {userDetails ? (
        <div
          className={isDarkMode ? 'sideNameMenuContainer' : 'd-sideNameMenuContainer'}
          onClick={handleProfile}
        >
          <div className="sideMenuProfileImageContainer">
            {userDetails && (
              <img
                src={userDetails.pfp ? userDetails.pfp : defaultProfile}
                className="sideProfileImage"
              />
            )}
          </div>
          <div className="menuSelfDetail">
            <div className="menuNameContainer">
              {userDetails && (
                <p className={isDarkMode ? 'menuName' : 'd-menuName'}>
                  {userDetails.display_name ? userDetails.display_name : 'User'}
                </p>
              )}
            </div>
            <div className="menuUserNameContainer">
              {isProfilePage ? (
                <p
                  className={isDarkMode ? 'menuUserName' : 'd-menuUserName'}
                  style={{ color: '#6E44FF', fontWeight: '600' }}
                >
                  @{userDetails.username}
                </p>
              ) : (
                <p className={isDarkMode ? 'menuUserName' : 'd-menuUserName'}>
                  @{userDetails.username}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={isDarkMode ? 'sideNameMenuContainer' : 'd-sideNameMenuContainer'}>
          <div className="sideMenuProfileImageContainer">
            <img src={defaultProfile} className="sideProfileImage" />
          </div>
          <div className="menuSelfDetail">
            <div className="menuNameContainer">
              <p className={isDarkMode ? 'menuName' : 'd-menuName'}>User</p>
            </div>
            <div className="menuUserNameContainer">
              <p className={isDarkMode ? 'menuUserName' : 'd-menuUserName'}>@Username</p>
            </div>
          </div>
        </div>
      )}

      <button className="sidePostButton" onClick={handlePost}>
        Post
      </button>
    </div>
  );
};

export default Sidebar;
