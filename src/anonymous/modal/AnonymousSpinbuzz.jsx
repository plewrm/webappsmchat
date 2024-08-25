import React, { useState, useEffect } from 'react';
import '../../modals/Spinbuzz.css';
import { useDispatch } from 'react-redux';
import close from '../../assets/icons/modal-close.svg';
import lightMore from '../../assets/icons/light-more-vertical.svg';
import verify from '../../assets/icons/verify.svg';
import { setAnonymousspinBuzz, closeRevealProfile } from '../../redux/slices/modalSlice';
import sendHi from '../../assets/icons/sendHi_.svg';

import {
  BASE_URL,
  BEARER_TOKEN,
  FINDSPINBUZZUSER,
  SENDGETMESSAGETOMATCH,
  SPINBUZZ_USER,
  SPINBUZZ_USER_ANON
} from '../../api/EndPoint';
import axios from 'axios';
import { setGlobalSpinBuzzState } from '../../redux/slices/anonSlices';
import { useSelector } from 'react-redux';
import { APIProvider, Map, InfoWindow } from '@vis.gl/react-google-maps';
import { useMapOptions } from '../../modals/spinbuzzNew/style';
import { useTheme } from '../../context/ThemeContext';
import styles from '../../modals/spinbuzzNew/SpinbuzzV2.module.css';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import AnonymousMatchProfile from './AnonymousMatchProfile';
import {
  setIsAnimating,
  setSpinBuzzUserAnon,
  setSpinMatchModal
} from '../../redux/slices/spinbuzzSlices';

const AnonymousSpinbuzz = () => {
  const { isDarkMode } = '';
  const mapOptions = useMapOptions();
  const dispatch = useDispatch();
  // const [spinMatchModal, setSpinMatchModal] = useState(false);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const globalSpinBuzzState = useSelector((state) => state.community.globalSpinBuzzState);
  const anonymousspinBuzz = useSelector((state) => state.modal.anonymousspinBuzz);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const isAnimating = useSelector((state) => state.spinbuzz.isAnimating);
  const spinBuzzUserAnon = useSelector((state) => state.spinbuzz.spinBuzzUserAnon);
  const spinMatchModal = useSelector((state) => state.spinbuzz.spinMatchModal);

  const closeSpinbuzzModalHandler = () => {
    dispatch(setAnonymousspinBuzz(false));
    dispatch(closeRevealProfile());
  };

  const openSpinMatchModal = () => {
    dispatch(setIsAnimating(true));
    // setInterval(() => {
    dispatch(setSpinMatchModal(true));
    // }, 2000);
  };
  const closeSpinMatchModal = () => {
    dispatch(setSpinMatchModal(false));
    // dispatch(closeRevealProfile())
  };

  // const [spinBuzzUser, setSpinBuzzUser] = useState(null);
  const fetchSpinBuzzUser = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${FINDSPINBUZZUSER}`, { headers });
      console.log(response.data);
      dispatch(setSpinBuzzUserAnon(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSpinBuzzUser();
  }, [spinMatchModal]);

  const [locations, setLocations] = useState([]);

  const listSpinBuzzUser = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${SPINBUZZ_USER_ANON}`, { headers });
      const userLocations = response.data.users.map((user) => ({
        lat: user.latitude,
        lng: user.longitude,
        image: `https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`
      }));
      setLocations(userLocations);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (anonymousspinBuzz) {
      listSpinBuzzUser();
    }
  }, [anonymousspinBuzz]);

  const checkAge = (item) => {
    console.log();
    if (item == '0') {
      return 'Below 18';
    } else if (item == '1') {
      return '18-25';
    } else if (item == '2') {
      return '25-35';
    } else if (item == '3') {
      return '35-45';
    } else if (item == '4') {
      return '45-60';
    } else if (item == '5') {
      return 'Above 60';
    }
  };

  const sendMessage = async (username) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${SENDGETMESSAGETOMATCH}${username}`,
        { text: 'Hi...' },
        { headers }
      );
      console.log(response.data);
      dispatch(setGlobalSpinBuzzState(!globalSpinBuzzState));
      closeSpinMatchModal();
      closeSpinbuzzModalHandler();
    } catch (err) {
      console.log(err);
    }
  };

  const animationStyles = isDarkMode
    ? isAnimating
      ? {
          animation: 'shadowAnimation 1s infinite',
          boxShadow: `
    0 0 0 16px #6E44FF,
    0 0 0 32px #8967FD,
    0 0 0 48px #B19BF9
  `
        }
      : {
          boxShadow: `
    0 0 0 16px #6E44FF,
    0 0 0 32px #8967FD,
    0 0 0 48px #B19BF9
  `
        }
    : isAnimating
      ? {
          animation: 'shadowAnimation 1s infinite',
          boxShadow: `
    0 0 0 16px #6E44FF,
    0 0 0 32px #5536BE,
    0 0 0 48px #3C297C
  `
        }
      : {
          boxShadow: `
    0 0 0 16px #6E44FF,
    0 0 0 32px #5536BE,
    0 0 0 48px #3C297C
  `
        };

  return (
    <>
      <div className={isDarkMode ? styles.outerContainer : styles['d-outerContainer']}>
        <div className={isDarkMode ? styles.innerContainer : styles['d-innerContainer']}>
          <>
            <div className={isDarkMode ? styles.header : styles['d-header']}>
              <div className={styles.closeIconContainer}>
                <img
                  src="/darkIcon/closeModalDark.svg"
                  alt="close"
                  className={styles.closeIcon}
                  onClick={closeSpinbuzzModalHandler}
                />
              </div>
              <div className={styles.tittleContainer}>
                <p className={isDarkMode ? styles.tittle : styles['d-tittle']}>SpinBuzz</p>
              </div>
            </div>

            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <div className={styles.mapImageContainer}>
                <Map defaultZoom={2} options={mapOptions} center={{ lat: 0, lng: 0 }}>
                  {locations.map((location, index) => (
                    <InfoWindow key={index} position={{ lat: location.lat, lng: location.lng }}>
                      <div className={styles.infoWindowContent}>
                        <img
                          src={location.image || defaultProfile}
                          alt="avatar"
                          className={styles.locationImage}
                        />
                      </div>
                    </InfoWindow>
                  ))}
                </Map>
                <div
                  className={styles.avatarImgContainer}
                  style={animationStyles}
                  onClick={openSpinMatchModal}
                >
                  {anonDetails && (
                    <img
                      src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${anonDetails.avatar}.png`}
                      alt="avatar"
                      className="map-avatar"
                    />
                  )}
                </div>
              </div>
            </APIProvider>

            {spinMatchModal && spinBuzzUserAnon && (
              <>
                {/* <div className="spin-match-outer-modal" onClick={closeSpinMatchModal}></div>
                <div className={isDarkMode ? 'spin-match-modal-box' : 'd-spin-match-modal-box'}>
                  <div className="spin-match-header">
                    
                    <div className="matched-avatar-container">
                      <img
                        src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${spinBuzzUserAnon.avatar}.png`}
                        alt="avatar"
                        className="matched-avatar"
                      />
                      <div className="verify-match-user-container">
                        <img src={verify} alt="verify" className="verify-match-user" />
                      </div>
                    </div>

                    <div>
                      <div className="matched-username-container">
                        <p className={isDarkMode ? 'matched-username' : 'd-matched-username'}>
                          @{spinBuzzUserAnon.username}
                        </p>
                      </div>
                      <div className="matched-location-container">
                        <p className={isDarkMode ? 'matched-location' : 'd-matched-location'}>
                          {checkAge(spinBuzzUserAnon.ageRange)}, <span>India</span>
                        </p>
                      </div>
                    </div>

                    <div className="matched-intrest-box">
                      <div className="matched-intrest-flex">
                        {spinBuzzUserAnon.hobbies.map((interest, index) => (
                          <div
                            key={index}
                            className={
                              isDarkMode
                                ? 'matched-intrest-name-container'
                                : 'd-matched-intrest-name-container'
                            }
                          >
                            <p
                              className={
                                isDarkMode ? 'matched-intrest-name' : 'd-matched-intrest-name'
                              }
                            >
                              {interest}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="matched-language-box">
                      <div className="matched-intrest-flex">
                        {spinBuzzUserAnon.languages.map((language, index) => (
                          <div
                            key={index}
                            className={
                              isDarkMode
                                ? 'matched-language-name-container'
                                : 'd-matched-language-name-container'
                            }
                          >
                            <p
                              className={
                                isDarkMode ? 'matched-language-name' : 'd-matched-language-name'
                              }
                            >
                              {language}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className={
                        isDarkMode
                          ? 'spin-matched-info-container'
                          : 'd-spin-matched-info-container'
                      }
                    >
                      <p className={isDarkMode ? 'spin-matched-info' : 'd-spin-matched-info'}>
                        {spinBuzzUserAnon.bio}
                      </p>
                    </div>

                    <div className="spin-matched-buttons-container">
                      <div
                        onClick={closeSpinMatchModal}
                        className={
                          isDarkMode ? 'spin-again-btn-container' : 'd-spin-again-btn-container'
                        }
                      >
                        <p className={isDarkMode ? 'spin-again-btn' : 'd-spin-again-btn'}>
                          Spin Again
                        </p>
                      </div>

                      <button
                        onClick={() => sendMessage(spinBuzzUserAnon.username)}
                        className={isDarkMode ? 'send-hi-button' : 'd-send-hi-button'}
                      >
                        <img src={sendHi} alt="Hi Icon" className="send_Hi-btn" />
                        Send Hi!
                      </button>
                    </div>
                  </div>
                </div> */}
                <AnonymousMatchProfile />
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default AnonymousSpinbuzz;
