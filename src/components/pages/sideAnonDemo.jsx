import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import profileImg from '../../assets/images/profile-pic.png';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  openCreatePostModal,
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
import { setDiscoverTab } from '../../redux/slices/sideBarSlices';
import { BASE_URL, BEARER_TOKEN, GETANON } from '../../api/EndPoint';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAnonLoader } from '../../redux/slices/loaderSlice';
import { setAnonDetails } from '../../redux/slices/anonSlices';
import { setOnWait } from '../../redux/slices/anonSlices';
import { setNewFeatures } from '../../redux/slices/upcomingSlice';

export default function SideBarAnon() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(true);
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
  }, [globalAnonProfileUpdate, anonymousView]);

  const openAnonymousCreatePost = () => {
    dispatch(setAnonymousCreateProfile(true));
  };

  const openAnonymousNotification = () => {
    dispatch(setAnonymousSelfProfile(false));
    dispatch(setDiscoverTab(false));
    dispatch(setIsAnonymousHomeSelected(false));
    navigate('anon/notifications');
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
    dispatch(setDiscoverTab(true));
    dispatch(setAnonymousNotification(false));
    dispatch(setIsAnonymousHomeSelected(false));
    dispatch(setAnonymousSelfProfile(false));
    navigate('anon/discovers');
  };

  const anonymousHome = () => {
    dispatch(setIsAnonymousHomeSelected(true));
    dispatch(setAnonymousSelfProfile(false));
    dispatch(setAnonymousNotification(false));
    dispatch(setDiscoverTab(false));
    navigate('anon/homepage');
  };

  const toggleAnonymousView = async () => {
    dispatch(setAnonLoader(true));
    setIsActive(false);
    dispatch(setAnonymousView(false));
    navigate('/homepage');
  };

  const handleNewFeature = () => {
    dispatch(setNewFeatures(true));
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
    <div className="newSide">
      <div className="d-newSidefirst_ano">
        <div className="newSideIconContainer_ano">
          <img src="/icon/soconIconAnon.svg" alt="socon" className="newSideIcon" />
          <div className="newVectorContainer">
            <img src="/icon/cap.svg" alt="cap" className="newVector" />
          </div>
        </div>
        <div className={`switch-toggle ${isActive ? 'active' : ''}`} onClick={toggleAnonymousView}>
          <div className={`switch-handle ${isActive ? 'active-handle' : ''}`}>
            <img src="/icon/toggle.svg" alt="Toggle Image" className="toggle-image" />
          </div>
        </div>
        {anonDetails ? (
          <>
            <div className="newProfileSideContainer_ano" onClick={openAnonymousSelfProfile}>
              <img
                src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${anonDetails.avatar}.png`}
                alt="profile"
                className="newProfileSide"
              />
            </div>

            <div className="newSideNameContainer_ano" onClick={openAnonymousSelfProfile}>
              <p className="d-newSideName">@{anonDetails.name}</p>
            </div>
          </>
        ) : (
          <>
            <div className="newProfileSideContainer_ano">
              <img src={profileImg} alt="profile" className="newProfileSide" />
            </div>

            <div className="newSideNameContainer_ano">
              <p className="d-newSideName">anon user</p>
            </div>
          </>
        )}
      </div>

      <div className="d-newSidesecond">
        <div className="newSideColumn" onClick={handleAnomymousSpinbuzz}>
          <div className="newWaveSideContainer">
            <img src="/icon/spinbuzz.svg" alt="wave" className="newWaveSide" />
          </div>
          <div className="newWaveTextContainer">
            <p className="d-newWaveText">Spinbuzz</p>
          </div>
        </div>

        <div className="newSideColumn" onClick={anonymousHome}>
          <div className="newIconSContainer">
            <img
              src={
                ['/anon/homepage'].includes(location.pathname)
                  ? '/icon/homeActive.png'
                  : '/darkIcon/homeDark.png'
              }
              alt="home"
              className="newIconS"
            />
          </div>
          <div className="newWaveTextContainer">
            {['/anon/homepage'].includes(location.pathname) ? (
              <p className="d-newWaveText active">Home</p>
            ) : (
              <p className="d-newWaveText">Home</p>
            )}
          </div>
        </div>

        <div className="newSideColumn" onClick={handleDiscover}>
          <div className="newIconSContainer">
            {['/anon/discovers'].includes(location.pathname) ? (
              <img src="/icon/discoverActive.svg" alt="wave" className="newIconS" />
            ) : (
              <img src="/darkIcon/discoverDark.svg" alt="wave" className="newIconS" />
            )}
          </div>
          <div className="newWaveTextContainer">
            {['/anon/discovers'].includes(location.pathname) ? (
              <p className="d-newWaveText active">Discover</p>
            ) : (
              <p className="d-newWaveText">Discover</p>
            )}
          </div>
        </div>

        <div className="newSideColumn" onClick={handleNewFeature}>
          <div className="newIconSContainer">
            <img src="/darkIcon/messagesDark.svg" alt="wave" className="newIconS" />
          </div>
          <div className="newWaveTextContainer">
            <p className="d-newWaveText">Messages</p>
          </div>
        </div>

        <div className="newSideColumn" onClick={handleNewFeature}>
          <div className="newIconSContainer">
            {['/anon/notifications'].includes(location.pathname) ? (
              <img src="/icon/notificationActive.svg" alt="wave" className="newIconS" />
            ) : (
              <img src="/darkIcon/notificationDark.svg" alt="wave" className="newIconS" />
            )}
          </div>
          <div className="newWaveTextContainer">
            {['/anon/notifications'].includes(location.pathname) ? (
              <p className="d-newWaveText active">Notification</p>
            ) : (
              <p className="d-newWaveText">Notification</p>
            )}
          </div>
        </div>

        <div className="newSideColumn" onClick={openAnonymousCreatePost}>
          <div className="newIconSContainerCps">
            <img src="/icon/createPost.svg" alt="wave" className="newIconSContainercp" />
          </div>
          <div className="newWaveTextContainer">
            <p className="d-newWaveText">Create Post</p>
          </div>
        </div>
      </div>
    </div>
  );
}
