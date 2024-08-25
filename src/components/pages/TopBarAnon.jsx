import React, { useEffect, useState } from 'react';
import './TopBar.css';
import socon from '../../assets/icons/Logo.svg';
import Home from '../../assets/icons/home_p.png';
import AddLight from '../../assets/icons/add-square_light.svg';
import AddDark from '../../assets/icons/add-square_dark.svg';
import spinbuzzImg from '../../assets/icons/spin-sb.svg';
import toggleImg from '../../assets/icons/toggle-img.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETANON,
  GETPROFILE,
  GETUSERPROFILE,
  retrievedSoconId
} from '../../api/EndPoint';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  sethomeTab,
  setpostTab,
  setmessageTab,
  setnotificationTab
} from '../../redux/slices/topBarSlices';
import {
  openCreatePostModal,
  setAnonymousCreateProfile,
  setAnonymousspinBuzz,
  setNewFeature
} from '../../redux/slices/modalSlice';
import { setAnonymousView } from '../../redux/slices/anonViewSlice';
import { useNavigate } from 'react-router-dom';
import { setAnonLoader } from '../../redux/slices/loaderSlice';
import AnonymousAddPost from '../../anonymous/component/AddPost/AnonymousAddPost';
import { setAnonMessageMobile, setMessageMobile } from '../../redux/slices/mobileActionSlices';

const TopBarAnon = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();
  const [anonDetails, setAnonDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const globalProfileState = useSelector((state) => state.loader.globalProfileState);
  const anonymousView = useSelector((state) => state.anonView.anonymousView);
  const [isOn, setIsOn] = useState(true);

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
      console.error(error);
    }
  };

  useEffect(() => {
    getUserProfileDetails();
  }, [globalProfileState]);

  const handleHome = () => {
    navigate('/anon/homepage');
  };
  const handleDiscover = () => {
    console.log('hello');
    navigate('/anon/discovers');
  };

  const handleNotification = () => {
    dispatch(setNewFeature(true));
  };

  const handleSearch = () => {
    navigate('/anon/discovers');
  };

  const openAnonymousSelfProfile = () => {
    navigate(`/anon/${anonDetails.name}`);
  };

  const openAnonMessage = () => {
    console.log('msg clicked');
    dispatch(setAnonMessageMobile(true));
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

  const { isDarkMode, toggleTheme } = '';
  useEffect(() => {
    getMyProfile();
  }, []);

  const toggleAnonymousView = async () => {
    dispatch(setAnonLoader(true));
    // console.log(isActive)
    // if(isActive){

    // }else{
    //   setIsActive(true);
    //   dispatch(setAnonymousView(true));
    //   navigate('/anon/homepage')
    // }
    setIsOn(false);
    dispatch(setAnonymousView(false));
    navigate('/homepage');
  };
  const getAnonProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${GETANON}`, { headers });
      console.log(response.data);
      if (response.data.message === 'Success') {
        dispatch(setAnonDetails(response.data.data));
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch(setAnonLoader(false));
    }
  };

  useEffect(() => {
    getAnonProfile();
  }, []);

  return (
    <div>
      <>
        <div
          className="top-nav-container"
          style={{ backgroundColor: !isDarkMode ? '#191622' : '#fff' }}
        >
          <div className={!isDarkMode ? 'top-nav-header1_dark' : 'top-nav-header1'}>
            <div className="toggle-container">
              <div
                className={`toggle-switch ${isOn ? 'toggle-switch-on' : 'toggle-switch-off'}`}
                onClick={toggleAnonymousView}
              >
                <div className={`toggle-circle ${isOn ? 'toggle-on' : 'toggle-off'}`}>
                  {anonDetails && (
                    <img
                      src={
                        isOn
                          ? `https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${anonDetails.avatar}.png`
                          : '/sidebar/toggle.svg'
                      }
                      alt="Toggle circle"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="icon-container">
              <img onClick={toggleTheme} src={socon} alt="socon" className="socon-icon" />
            </div>
            <div className="spacing">
              <div className="more-icon-container" onClick={handleSearch}>
                <img src="/darkIcon/searchDark.svg" alt="more" className="more-icon" />
              </div>
              <div className="search-icon-container" onClick={openAnonMessage}>
                <img src="/darkIcon/messagesDark.svg" alt="search" className="search-icon" />
              </div>
              <div className="more-icon-container" onClick={handleNotification}>
                <img src="/darkIcon/notificationDark.svg" alt="more" className="more-icon" />
              </div>
            </div>
          </div>

          <div className={!isDarkMode ? 'top-nav-header2_dark' : 'top-nav-header2'}>
            <div className="home-icon-container">
              <img src={Home} alt="Home" className="home-icon" onClick={handleHome} />
            </div>

            <div className="home-icon-container">
              <img
                src="/darkIcon/discoverDark.svg"
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
              {anonDetails && (
                <img
                  src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${anonDetails.avatar}.png`}
                  alt="ProfilePic"
                  className="home-icon-profile"
                  onClick={openAnonymousSelfProfile}
                />
              )}
            </div>
          </div>
          <AnonymousAddPost />
        </div>
      </>
    </div>
  );
};

export default TopBarAnon;
