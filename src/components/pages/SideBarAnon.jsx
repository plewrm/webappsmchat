import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  openCreatePostModal,
  setAnonymousCreateProfile,
  setOpponentProfile,
  setAnonymousspinBuzz,
  setAnonymousNotification,
  setAnonymousSelfProfile,
  setGlobalSearchScreen,
  setExpandPostModal,
  setIsAnonymousHomeSelected,
  setNewFeature
} from '../../redux/slices/modalSlice';
import { setAnonymousView } from '../../redux/slices/anonViewSlice';
import { setDiscoverTab } from '../../redux/slices/sideBarSlices';
import { BASE_URL, BEARER_TOKEN, GETANON } from '../../api/EndPoint';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAnonLoader } from '../../redux/slices/loaderSlice';
import { setAnonDetails } from '../../redux/slices/anonSlices';
import { setOnWait } from '../../redux/slices/anonSlices';
const SideBarAnon = () => {
  const { isDarkMode } = useTheme();
  const [isOn, setIsOn] = useState(true);
  const dispatch = useDispatch();

  const anonDetails = useSelector((state) => state.community.anonDetails);
  const anonymousView = useSelector((state) => state.anonView.anonymousView);

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('token') || !localStorage.getItem('soconId')) {
      navigate('/');
    }
  }, [navigate]);

  const globalAnonProfileUpdate = useSelector((state) => state.community.globalAnonProfileUpdate);
  useEffect(() => {
    getAnonProfile();
  }, [globalAnonProfileUpdate, anonymousView, anonDetails?.avatar]);

  const openAnonymousCreatePost = () => {
    dispatch(setAnonymousCreateProfile(true));
  };

  const handleAnomymousSpinbuzz = () => {
    dispatch(setAnonymousspinBuzz(true));
  };

  const openAnonymousSelfProfile = () => {
    dispatch(setAnonymousNotification(false));
    dispatch(setDiscoverTab(false));
    dispatch(setIsAnonymousHomeSelected(false));
    navigate(`/anon/${anonDetails.name}`);
  };

  const handleDiscover = () => {
    navigate('anon/discovers');
  };

  const anonymousHome = () => {
    navigate('anon/homepage');
  };

  const toggleAnonymousView = async () => {
    dispatch(setAnonLoader(true));
    setIsOn(false);
    dispatch(setAnonymousView(false));
    navigate('/homepage');
  };

  const handleNewFeature = () => {
    dispatch(setNewFeature(true));
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
      console.log(error.message);
    } finally {
      dispatch(setAnonLoader(false));
      dispatch(setOnWait(true));
    }
  };

  return (
    <div className="d-sideBarContainer">
      <div className="soconsideIconContainer">
        <img src="/sidebar/socon.svg" className="soconSideIcon" />
      </div>

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

      <div className="d-sideSpinbuzzContainer" onClick={handleAnomymousSpinbuzz}>
        <div className="sideSpinbuzzImageContainer">
          <img src="/sidebar/spinbuzz.svg" className="sideSpinbuzzImage" />
        </div>
        <p className="d-menuText">Spinbuzz</p>
      </div>

      <div className="d-sideMenuContainer" onClick={anonymousHome}>
        {['/anon/homepage'].includes(location.pathname) ? (
          <div className="sideMenuImageContainer">
            <img src="/sidebar/selectedHome.svg" className="sidehomeImage" />
          </div>
        ) : (
          <div className="sideMenuImageContainer">
            <img src="/sidebar/home.svg" className="sidehomeImage" />
          </div>
        )}
        {['/anon/homepage'].includes(location.pathname) ? (
          <div className="menuTextContainer">
            <p className="d-menuTextActive">Home</p>
          </div>
        ) : (
          <div className="menuTextContainer">
            <p className="d-menuText">Home</p>
          </div>
        )}
      </div>

      <div className="d-sideMenuContainer" onClick={handleDiscover}>
        {['/anon/discovers'].includes(location.pathname) ? (
          <div className="sideMenuImageContainer">
            <img src="/sidebar/selectedDiscover.svg" className="sidehomeImage" />
          </div>
        ) : (
          <div className="sideMenuImageContainer">
            <img src="/sidebar/discover.svg" className="sidehomeImage" />
          </div>
        )}
        {['/anon/discovers'].includes(location.pathname) ? (
          <div className="menuTextContainer">
            <p className="d-menuTextActive">Discover</p>
          </div>
        ) : (
          <div className="menuTextContainer">
            <p className="d-menuText">Discover</p>
          </div>
        )}
      </div>

      <div
        className={isDarkMode ? 'sideMenuContainer' : 'd-sideMenuContainer'}
        onClick={handleNewFeature}
      >
        <div className="sideMenuImageContainer">
          <img src="/sidebar/messages.svg" className="sidehomeImage" />
        </div>
        <p className="d-menuText">Messages</p>
      </div>

      <div className="d-sideMenuContainer" onClick={handleNewFeature}>
        <div className="sideMenuImageContainer">
          <img src="/sidebar/notification.svg" className="sidehomeImage" />
        </div>
        <p className="d-menuText">Notifications</p>
      </div>

      {anonDetails ? (
        <div className="d-sideNameMenuContainer" onClick={openAnonymousSelfProfile}>
          <div className="sideMenuProfileImageContainer">
            {anonDetails && (
              <img
                src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${anonDetails.avatar}.png`}
                className="sideProfileImage"
              />
            )}
          </div>
          <div className="menuSelfDetail">
            <div className="menuNameContainer">
              {location.pathname === `/anon/${anonDetails.name}` ? (
                <p className="d-menuName" style={{ color: '#6E44FF', fontWeight: '600' }}>
                  @{anonDetails.name}
                </p>
              ) : (
                <p className="d-menuName">@{anonDetails.name}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-sideNameMenuContainer">
          <div className="sideMenuProfileImageContainer">
            <img src="/sidebar/profile.svg" className="sideProfileImage" />
          </div>
          <div className="menuSelfDetail">
            <div className="menuNameContainer">
              <p className="d-menuName">@usename</p>
            </div>
          </div>
        </div>
      )}

      <button className="sidePostButton" onClick={openAnonymousCreatePost}>
        Post
      </button>
    </div>
  );
};

export default SideBarAnon;
