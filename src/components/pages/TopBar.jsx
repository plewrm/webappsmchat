import React, { useEffect, useState } from 'react';
import './TopBar.css';
import socon from '../../assets/icons/Logo.svg';
import search from '../../assets/icons/search.svg';
import searchDark from '../../assets/icons/searchDark.svg';
import Home from '../../assets/icons/home_p.png';
import DiscoverLight from '../../assets/icons/discover.svg';
import DiscoverDark from '../../assets/icons/discover_dark.svg';
import AddLight from '../../assets/icons/add-square_light.svg';
import AddDark from '../../assets/icons/add-square_dark.svg';
import MessagesLight from '../../assets/icons/messages_light.svg';
import MessagesDark from '../../assets/icons/messages_dark.svg';
import NotificationLight from '../../assets/icons/notification_light.svg';
import NotificationDark from '../../assets/icons/notification_dark.svg';
import waveNearByImg from '../../assets/icons/wave-sb.svg';
import spinbuzzImg from '../../assets/icons/spin-sb.svg';
import { useTheme } from '../../context/ThemeContext';
import toggleImg from '../../assets/icons/toggle-img.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETANON,
  GETPROFILE,
  GETUSERPROFILE,
  NOTIFICATIONSCOUNT,
  retrievedSoconId
} from '../../api/EndPoint';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  openCreatePostModal,
  setAnonymousCreateProfile,
  setAnonymousspinBuzz,
  setGlobalSearchScreen
} from '../../redux/slices/modalSlice';
import { setAnonymousView } from '../../redux/slices/anonViewSlice';
import { useNavigate } from 'react-router-dom';
import { setAnonLoader, setResponseLoader } from '../../redux/slices/loaderSlice';
import AnonymousAddPost from '../../anonymous/component/AddPost/AnonymousAddPost';
import { setMessageMobile } from '../../redux/slices/mobileActionSlices';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import './Sidebar.css';
import { setSpinbuzzNew } from '../../redux/slices/spinbuzzSlices';

export default function TopBar() {
  const [notificationCount, setNotificationCount] = useState(0);
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [anonDetails, setAnonDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isOn, setIsOn] = useState(false);
  const globalProfileState = useSelector((state) => state.loader.globalProfileState);
  const anonymousView = useSelector((state) => state.anonView.anonymousView);
  const openAnonymousCreatePost = () => {
    dispatch(setAnonymousCreateProfile(true));
  };
  const handleAnomymousSpinbuzz = () => {
    dispatch(setAnonymousspinBuzz(true));
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

  const handleHome = () => {
    navigate('/homepage');
  };
  const handleDiscover = () => {
    navigate('/discovers');
  };
  const handleCreatePost = () => {
    dispatch(openCreatePostModal());
  };
  const handleMessage = () => {
    dispatch(setMessageMobile(true));
  };
  const handleNotification = () => {
    navigate('/notifications');
  };

  const handleProfile = () => {
    navigate(`/profile/${userDetails.username}/${userDetails.soconId}`, {
      state: { soconId: userDetails.soconId }
    });
  };

  const handleSearch = () => {
    // navigate('/search');
    dispatch(setGlobalSearchScreen(true));
  };
  const handleWaveNearby = () => {
    navigate('/wavenearby');
  };

  const openSpinbuzzNew = () => {
    dispatch(setSpinbuzzNew(true));
  };

  const openAnonymousSelfProfile = () => {
    navigate(`/anon/${anonDetails.name}`);
  };

  const [userProfile, setUserProfile] = useState(null);
  const getMyProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${BASE_URL}${GETUSERPROFILE}${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );
      setUserProfile(response.data.profile);
    } catch (error) {
      console.error(error);
    }
  };

  const { isDarkMode, toggleTheme } = useTheme();
  useEffect(() => {
    getMyProfile();
  }, []);

  // const toggleAnonymousView = async () => {
  //   dispatch(setAnonLoader(true));
  //   setIsOn(true);
  //   dispatch(setAnonymousView(true));
  //   navigate('/anon/homepage');
  // };

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

  const openCreatePostModalHandler = () => {
    dispatch(openCreatePostModal());
  };
  return (
    <>
      {!anonymousView && (
        <>
          <div
            className="top-nav-container"
            style={{ backgroundColor: !isDarkMode ? '#191622' : '#fff' }}
          >
            <div className={!isDarkMode ? 'top-nav-header1_dark' : 'top-nav-header1'}>
              {/* <div
                className={`switch-toggle ${isActive ? 'active' : ''}`}
                onClick={toggleAnonymousView}
                style={{ background: isDarkMode ? '#D9D9D9' : '#615E69' }}
              >
                <div className={`switch-handle ${isActive ? 'active-handle' : ''}`}>
                  <img src="/icon/toggle.svg" alt="Toggle Image" className="toggle-image" />
                </div>
              </div> */}

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

              <div className="icon-container" onClick={toggleTheme}>
                <img src={socon} alt="socon" className="socon-icon" />
              </div>
              <div className="spacing">
                <div className="more-icon-container" onClick={handleSearch}>
                  <img
                    src={isDarkMode ? '/lightIcon/searchLight.svg' : '/darkIcon/searchDark.svg'}
                    alt="more"
                    className="more-icon"
                  />
                </div>
                <div className="search-icon-container" onClick={handleMessage}>
                  <img
                    src={isDarkMode ? '/lightIcon/messagesLight.svg' : '/darkIcon/messagesDark.svg'}
                    alt="search"
                    className="search-icon"
                  />
                </div>
                <div className="more-icon-container" onClick={handleNotification}>
                  <div className="newIconSContainer">
                    <img
                      src={
                        isDarkMode
                          ? '/lightIcon/notificationLight.svg'
                          : '/darkIcon/notificationDark.svg'
                      }
                      alt="more"
                      className="more-icon"
                    />
                    <span className="notifyCounts">{notificationCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={!isDarkMode ? 'top-nav-header2_dark' : 'top-nav-header2'}>
              <div className="home-icon-container">
                <img src={Home} alt="Home" className="home-icon" onClick={handleHome} />
              </div>

              <div className="home-icon-container">
                <img
                  src={isDarkMode ? '/lightIcon/discoverLight.svg' : '/darkIcon/discoverDark.svg'}
                  alt="DiscoverLight"
                  className="home-icon"
                  onClick={handleDiscover}
                />
              </div>

              <div className="wave-icon-container">
                <img
                  src={spinbuzzImg}
                  alt="waveNearBy"
                  className="home-icon"
                  onClick={openSpinbuzzNew}
                />
              </div>

              <div className="home-icon-container">
                <img
                  src={!isDarkMode ? AddDark : AddLight}
                  alt="AddLight"
                  className="home-icon"
                  onClick={handleCreatePost}
                />
              </div>
              <div className="home-icon-container-profile">
                <img
                  src={userProfile && userProfile.pfp ? userProfile.pfp : defaultProfile}
                  alt="pfp"
                  className="home-icon-profile"
                  onClick={handleProfile}
                />
              </div>
            </div>

            <div
              className={isDarkMode ? 'topNavHeader3' : 'd-topNavHeader3'}
              onClick={openCreatePostModalHandler}
            >
              <div
                className={isDarkMode ? 'topSaySomehtingContainer' : 'd-topSaySomehtingContainer'}
              >
                <p className={isDarkMode ? 'topSaySomehting' : 'd-topSaySomehting'}>
                  Say Something...
                </p>
              </div>
              <div className="topHeaderIconContainer">
                <img
                  src={isDarkMode ? '/lightIcon/galleryLight.svg' : '/darkIcon/galleryDark.svg'}
                  alt="DiscoverLight"
                  className="topHeaderIcon"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {anonymousView && (
        <>
          <div
            className="top-nav-container"
            style={{ backgroundColor: !isDarkMode ? '#191622' : '#fff' }}
          >
            <div className={!isDarkMode ? 'top-nav-header1_dark' : 'top-nav-header1'}>
              <div
                className={`switch-toggle ${isActive ? 'active' : ''}`}
                onClick={toggleAnonymousView}
              >
                <div className={`switch-handle ${isActive ? 'active-handle' : ''}`}>
                  <img src={toggleImg} alt="Toggle Image" className="toggle-image" />
                </div>
              </div>
              <div className="icon-container">
                <img onClick={toggleTheme} src={socon} alt="socon" className="socon-icon" />
              </div>
              <div className="spacing">
                <div className="more-icon-container" onClick={handleSearch}>
                  <img src={!isDarkMode ? searchDark : search} alt="more" className="more-icon" />
                </div>
                <div className="search-icon-container">
                  <img
                    src={!isDarkMode ? MessagesDark : MessagesLight}
                    alt="search"
                    className="search-icon"
                  />
                </div>
                <div className="more-icon-container" onClick={handleNotification}>
                  <img
                    src={!isDarkMode ? NotificationDark : NotificationLight}
                    alt="more"
                    className="more-icon"
                  />
                </div>
              </div>
            </div>

            <div className={!isDarkMode ? 'top-nav-header2_dark' : 'top-nav-header2'}>
              <div className="home-icon-container">
                <img src={Home} alt="Home" className="home-icon" onClick={handleHome} />
              </div>

              <div className="home-icon-container">
                <img
                  src={!isDarkMode ? DiscoverDark : DiscoverLight}
                  alt="DiscoverLight"
                  className="home-icon"
                  onClick={handleDiscover}
                />
              </div>

              <div className="wave-icon-container">
                <img
                  src={spinbuzzImg}
                  alt="waveNearBy"
                  className="home-icon"
                  onClick={handleAnomymousSpinbuzz}
                />
              </div>

              <div className="home-icon-container">
                <img
                  src={!isDarkMode ? AddDark : AddLight}
                  alt="AddLight"
                  className="home-icon"
                  onClick={openAnonymousCreatePost}
                />
              </div>

              <div className="home-icon-container-profile">
                <img
                  src={socon}
                  alt="ProfilePic"
                  className="home-icon-profile"
                  onClick={openAnonymousSelfProfile}
                />
              </div>
            </div>
            <AnonymousAddPost />
          </div>
        </>
      )}
    </>
  );
}
