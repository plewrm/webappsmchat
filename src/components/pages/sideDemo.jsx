import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsHomeSelected,
  openWaveNearbyModal,
  openspinbuzzModal,
  openCreatePostModal,
  selectIsCreatePostModalOpen,
  setNotificationModal,
  setAnonymousCreateProfile,
  setOpponentProfile,
  setAnonymousspinBuzz,
  setAnonymousNotification,
  setAnonymousSelfProfile,
  setMessageHomeScreen,
  closeWaveNearbyModal,
  setDiscoverView,
  setGlobalSearchScreen,
  setExpandPostModal,
  setIsAnonymousHomeSelected
} from '../../redux/slices/modalSlice';
import { setAnonymousView } from '../../redux/slices/anonViewSlice';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETANON,
  GETPROFILE,
  retrievedSoconId,
  NOTIFICATIONSCOUNT
} from '../../api/EndPoint';
import axios from 'axios';
import { setUserProfile } from '../../redux/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAnonLoader } from '../../redux/slices/loaderSlice';
import { setAnonDetails } from '../../redux/slices/anonSlices';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import defaultCover from '../../assets/images/plain-cover.png';
import { toggleExpand } from '../../redux/slices/chatSlice';
import { setResponseLoader } from '../../redux/slices/loaderSlice';
import { clearMessageDb } from '../../xmtp/models/db';
import { setSpinbuzzNew } from '../../redux/slices/spinbuzzSlices';
//web3auth
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
  adapterSettings,
  uiConfig
} from '../../constants/web3auth';

const Sidebar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const [userDetails, setUserDetails] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);

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

  const navigate = useNavigate();
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

  const openSpinbuzzNew = () => {
    dispatch(setSpinbuzzNew(true));
  };

  const openCreatePostModalHandler = () => {
    dispatch(openCreatePostModal());
  };

  const openMessageHomeScreen = () => {
    dispatch(setMessageHomeScreen(true));
    dispatch(setDiscoverView(false));
    dispatch(setNotificationModal(false));
    dispatch(closeWaveNearbyModal());
    dispatch(setOpponentProfile(false));
    dispatch(setDiscoverView(false));
    dispatch(toggleExpand());
    navigate('/messages');
  };

  const openNotificationModal = () => {
    dispatch(setNotificationModal(true));
    dispatch(setMessageHomeScreen(false));
    dispatch(setOpponentProfile(false));
    dispatch(setDiscoverView(false));
    dispatch(setGlobalSearchScreen(false));
    dispatch(setIsHomeSelected(false));
    navigate('/notifications');
  };

  const handleOpenProfile = () => {
    dispatch(setMessageHomeScreen(false));
    dispatch(setNotificationModal(false));
    dispatch(closeWaveNearbyModal());
    dispatch(setDiscoverView(false));
    dispatch(setGlobalSearchScreen(false));
    dispatch(setExpandPostModal(false));
    dispatch(setIsHomeSelected(false));
    navigate(`/profile/${userDetails.username}/${userDetails.soconId}`, {
      state: { soconId: userDetails.soconId }
    });
  };

  const Home = () => {
    dispatch(setIsHomeSelected(true));
    dispatch(setDiscoverView(false));
    dispatch(setMessageHomeScreen(false));
    dispatch(setNotificationModal(false));
    dispatch(closeWaveNearbyModal());
    dispatch(setOpponentProfile(false));
    dispatch(setDiscoverView(false));
    dispatch(setGlobalSearchScreen(false));
    dispatch(setExpandPostModal(false));
    navigate('/homepage');
  };

  const OpenDiscovers = () => {
    dispatch(setDiscoverView(true));
    dispatch(setMessageHomeScreen(false));
    dispatch(setNotificationModal(false));
    dispatch(closeWaveNearbyModal());
    dispatch(setOpponentProfile(false));
    dispatch(setGlobalSearchScreen(false));
    dispatch(setExpandPostModal(false));
    dispatch(setIsHomeSelected(false));
    navigate('/discovers');
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
    setIsActive(true);
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

  return (
    <div>
      <div className="newSide">
        <div className={isDarkMode ? 'newSidefirst' : 'd-newSidefirst'}>
          <div className="newSideIconContainer" onClick={toggleTheme}>
            <img src="/icon/soconIcon.svg" alt="socon" className="newSideIcon" />
          </div>
          <div
            className={`switch-toggle ${isActive ? 'active' : ''}`}
            onClick={toggleAnonymousView}
            style={{ background: isDarkMode ? '#D9D9D9' : '#615E69' }}
          >
            <div className={`switch-handle ${isActive ? 'active-handle' : ''}`}>
              <div className="toggle-image-container">
                <img src="/icon/toggle.svg" alt="Toggle Image" className="toggle-image" />
              </div>
            </div>
          </div>
          {userDetails ? (
            <>
              <div className="newCoverSideContainer" onClick={handleOpenProfile}>
                <img
                  src={userDetails.cover_photo ? userDetails.cover_photo : defaultCover}
                  alt="cover"
                  className="newCoverSide"
                />
              </div>
              <div className="newProfileSideContainer" onClick={handleOpenProfile}>
                <img
                  src={userDetails.pfp ? userDetails.pfp : defaultProfile}
                  alt="profile"
                  className="newProfileSide"
                />
              </div>

              <div className="newSideNameContainer" onClick={handleOpenProfile}>
                <p className={isDarkMode ? 'newSideName' : 'd-newSideName'}>
                  {userDetails.display_name ? userDetails.display_name : 'User'}
                </p>
              </div>

              <div className="newSideUserNameContainer" onClick={handleOpenProfile}>
                <p className={isDarkMode ? 'newSideUserName' : 'd-newSideUserName'}>
                  @{userDetails.username}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="newCoverSideContainer">
                <img src={defaultCover} alt="cover" className="newCoverSide" />
              </div>
              <div className="newProfileSideContainer">
                <img src={defaultProfile} alt="profile" className="newProfileSide" />
              </div>

              <div className="newSideNameContainer">
                <p className={isDarkMode ? 'newSideName' : 'd-newSideName'}>User</p>
              </div>

              <div className="newSideUserNameContainer">
                <p className={isDarkMode ? 'newSideUserName' : 'd-newSideUserName'}>@user</p>
              </div>
            </>
          )}
        </div>

        <div className={isDarkMode ? 'newSidesecond' : 'd-newSidesecond'}>
          <div className="newSideColumn" onClick={openSpinbuzzNew}>
            <div className="newWaveSideContainer">
              <img src="/icon/waveNearBy.svg" alt="wave" className="newWaveSide" />
            </div>
            <div className="newWaveTextContainer">
              <p className={isDarkMode ? 'newWaveText' : 'd-newWaveText'}>Spinbuzz</p>
            </div>
          </div>

          <div className="newSideColumn" onClick={Home}>
            <div className="newIconSContainer">
              <img
                src={
                  ['/homepage'].includes(location.pathname)
                    ? '/icon/homeActive.png'
                    : isDarkMode
                      ? '/lightIcon/homeLight.png'
                      : '/darkIcon/homeDark.png'
                }
                alt="home"
                className="newIconS"
              />
            </div>
            <div className="newWaveTextContainer">
              {['/homepage'].includes(location.pathname) ? (
                <p className={isDarkMode ? 'newWaveText active' : 'd-newWaveText active'}>Home</p>
              ) : (
                <p className={isDarkMode ? 'newWaveText' : 'd-newWaveText'}>Home</p>
              )}
            </div>
          </div>

          <div className="newSideColumn" onClick={OpenDiscovers}>
            <div className="newIconSContainer">
              {['/discovers'].includes(location.pathname) ? (
                <img src="/icon/discoverActive.svg" alt="discover" className="newIconS" />
              ) : (
                <img
                  src={isDarkMode ? '/lightIcon/discoverLight.svg' : '/darkIcon/discoverDark.svg'}
                  alt="discover"
                  className="newIconS"
                />
              )}
            </div>
            <div className="newWaveTextContainer">
              {['/discovers'].includes(location.pathname) ? (
                <p className={isDarkMode ? 'newWaveText active' : 'd-newWaveText active'}>
                  Discover
                </p>
              ) : (
                <p className={isDarkMode ? 'newWaveText' : 'd-newWaveText'}>Discover</p>
              )}
            </div>
          </div>

          <div className="newSideColumn" onClick={openMessageHomeScreen}>
            <div className="newIconSContainer">
              {['/messages'].includes(location.pathname) ? (
                <img src="/icon/messageActive.svg" alt="message" className="newIconS" />
              ) : (
                <img
                  src={isDarkMode ? '/lightIcon/messagesLight.svg' : '/darkIcon/messagesDark.svg'}
                  alt="message"
                  className="newIconS"
                />
              )}
            </div>
            <div className="newWaveTextContainer">
              {['/messages'].includes(location.pathname) ? (
                <p className={isDarkMode ? 'newWaveText active' : 'd-newWaveText active'}>
                  Messages
                </p>
              ) : (
                <p className={isDarkMode ? 'newWaveText' : 'd-newWaveText'}>Messages</p>
              )}
            </div>
          </div>

          <div className="newSideColumn" onClick={openNotificationModal}>
            <div className="newIconSContainer">
              {['/notifications'].includes(location.pathname) ? (
                <img src="/icon/notificationActive.svg" alt="notification" className="newIconS" />
              ) : (
                <img
                  src={
                    isDarkMode
                      ? '/lightIcon/notificationLight.svg'
                      : '/darkIcon/notificationDark.svg'
                  }
                  alt="notification"
                  className="newIconS"
                />
              )}
              <span className="notifyCounts">{notificationCount}</span>
            </div>
            <div className="newWaveTextContainer">
              {['/notifications'].includes(location.pathname) ? (
                <p className={isDarkMode ? 'newWaveText active' : 'd-newWaveText active'}>
                  Notification
                </p>
              ) : (
                <p className={isDarkMode ? 'newWaveText' : 'd-newWaveText'}>Notification</p>
              )}
            </div>
          </div>

          <div className="newSideColumn" onClick={openCreatePostModalHandler}>
            <div className="newIconSContainerCps">
              <img src="/icon/createPost.svg" alt="wave" className="newIconSContainercp" />
            </div>
            <div className="newWaveTextContainer">
              <p className={isDarkMode ? 'newWaveText' : 'd-newWaveText'}>Create Post</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
