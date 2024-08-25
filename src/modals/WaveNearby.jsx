import React, { useEffect, useState } from 'react';
import './WaveNearby.css';
import { useDispatch, useSelector } from 'react-redux';
import { closeWaveNearbyModal } from '../redux/slices/modalSlice';
import { useTheme } from '../context/ThemeContext';
import location from '../assets/icons/location.svg';
import lightlocation from '../assets/icons/light-location.svg';
import { Switch, Slider } from 'antd';
import message from '../assets/icons/wave-msg.svg';
import verify from '../assets/icons/verify.svg';
import axios from 'axios';
import { BASE_URL, BEARER_TOKEN, GETNEARBYUSER, ADDLOCATION } from '../api/EndPoint';
import UserProfile from './UserProfile';
import HomeProfile from '../components/HomeProfile';
import { useNavigate } from 'react-router-dom';
import leftBack from '../assets/icons/dark_mode_arrow_left.svg';
import leftBackLight from '../assets/icons/arrow-left-lightMode.svg';
import defaultProfile from '../assets/icons/Default_pfp.webp';
import waveMsg from '../assets/icons/wave-msg.svg';
import refresh from '../assets/icons/refresh.svg';
import waveLLocation from '../assets/icons/wave-location.svg';
import {
  isPeerOnXmtpNetwork,
  saveConversation,
  startConversation
} from '../xmtp/models/conversations';
import { appendMessageData, setConversation } from '../redux/slices/chatSlice';
import toast from 'react-hot-toast';

const WaveNearby = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isToggleModalVisible, setToggleModalVisible] = useState(false);
  const [isToggleOn, setToggleOn] = useState(false);
  const [isLocationAllowed, setLocationAllowed] = useState(false);
  const [userDetails, setUserDetails] = useState('');
  const xmtp = useSelector((state) => state.auth.xmtp);
  const [openMsgBox, setOpenMsgBox] = useState(false);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const marks = {
    0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: {
      label: <span style={{ color: 'white' }}>90</span>
    }
  };

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setLocationError(null);

          const fun = async () => {
            const headers = {
              Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            };

            try {
              const response = await axios.post(
                `${BASE_URL}${ADDLOCATION}`,
                { latitude, longitude },
                { headers }
              );
              console.log(response.data);
            } catch (error) {
              console.error(error);
            }
          };
          fun();
        },
        (error) => {
          setLocationError(`Error: ${error.message}`);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };
  useEffect(() => {
    getCurrentLocation();
    // console.log(latitude)
    // console.log(longitude)
  }, []);

  const handlelocationChange = () => {
    setToggleModalVisible(true);
  };

  const handleToggleModalClose = () => {
    setToggleModalVisible(false);
  };

  const handleLocationClose = () => {
    setLocationAllowed(false);
  };

  const handleAllowLocation = () => {
    setToggleModalVisible(false);
    setLocationAllowed(true);
  };

  const [localState, setLocalState] = useState(false);
  const [soconId, setSococnId] = useState(null);
  const handleprofileClick = (card) => {
    // dispatch(openuserProfileModal());
    // dispatch(setnearByProfile(card))
    setSococnId(card.soconId);
    setLocalState(true);
    dispatch(closeWaveNearbyModal());
    // navigate(`/profile/${card.username}`)
    navigate(`/profile/${card.username}/${card.soconId}`, { state: { soconId: card.soconId } });
  };

  const handleWaveNearbyClose = () => {
    dispatch(closeWaveNearbyModal());
  };

  const [wavenearbyData, setWavenearbyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${GETNEARBYUSER}`, { headers });
      console.log(response.data);
      setWavenearbyData(response.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleMobileBack = () => {
    navigate('/homepage');
  };

  const greet = async (userDetails) => {
    const canMessage = await isPeerOnXmtpNetwork(xmtp, userDetails.walletAddress);
    if (!canMessage) {
      toast.error('cannot message this user, try later!');
      return;
    }
    setOpenMsgBox(true);
    const conversation = await startConversation(xmtp, userDetails);
    dispatch(setConversation(conversation));
    dispatch(
      appendMessageData({
        soconId: userDetails.soconId,
        display_name: userDetails.display_name,
        username: userDetails.username,
        timestamp: new Date().toDateString(),
        peerAddress: userDetails.walletAddress,
        isMaximized: true,
        isOpened: true,
        pfp: userDetails.pfp
      })
    );
  };

  const refreshusers = () => {
    fetchData();
  };

  return (
    <>
      {isMobileView && (
        <div className={isDarkMode ? 'mobileBackContainer' : 'd-mobileBackContainer'}>
          <div className="leftBackContainer" onClick={handleMobileBack}>
            <img src={isDarkMode ? leftBackLight : leftBack} alt="back" className="leftBack" />
          </div>
        </div>
      )}
      {
        // localState && soconId ?
        //     <HomeProfile />
        //     :
        <div className={isDarkMode ? 'wavenearby-container' : 'd-wavenearby-container'}>
          <div
            className={isDarkMode ? 'wavenearby-inner-container' : 'd-wavenearby-inner-container'}
          >
            {/* <button onClick={handleWaveNearbyClose}>close</button> */}

            <div className="wave-header-container">
              <div className="wave-header-title-container">
                <p className={isDarkMode ? 'wave-header-title' : 'd-wave-header-title'}>
                  Wave Nearby
                </p>
              </div>
              <div className="location-toggle-container">
                {/* <div className='wave-location-container'>
                                        {isDarkMode ? <img src={lightlocation} alt='location' className='wave-location' /> : <img src={location} alt='location' className='wave-location' />}
                                    </div> */}
                {/* <div className='refreshButtonContainer' onClick={handlelocationChange}>
                                        <img src={waveLLocation} alt='refresh' className='refreshButton' />
                                    </div> */}
                {/* <div className='toggle-container'>
                                        <Switch onChange={handleToggleChange} checked={isToggleOn} />
                                    </div> */}
                {/* <div onClick={refreshusers} className='refreshButtonContainer'>
                                        <img src={refresh} alt='refresh' className='refreshButton' />
                                    </div> */}
              </div>
            </div>
          </div>

          {loading && (
            <div className="loaderContainer">
              <div className={isDarkMode ? 'loader' : 'd-loader'}></div>
            </div>
          )}

          <div className="wave-outer-card-container">
            {wavenearbyData &&
              wavenearbyData.map((card, index) => (
                <div key={index} className="wave-inner-card-container">
                  <div className="wave-images-container">
                    <img
                      src={card.pfp ? card.pfp : defaultProfile}
                      className="wave-images"
                      onClick={() => handleprofileClick(card)}
                    />
                    <div className="wave-card-info">
                      <div className="wave-first-column">
                        <div className="wave-card-name-container">
                          <p className="wave-card-name">
                            {card.display_name ? card.display_name : 'user'}
                          </p>
                        </div>
                        {card.isVerified && (
                          <div className="wave-verify-container">
                            <img src={verify} alt="verify" className="wave-verify" />
                          </div>
                        )}
                      </div>
                      {/* <div className='wave-distance-container'>
                                                    <p className='wave-distance'>{card.distance}km</p>
                                                </div> */}
                    </div>
                    {/* {card.showMessage && ( */}
                    <div className="wave-message-icon-container" onClick={() => greet(card)}>
                      <img src={waveMsg} alt="message" className="wave-message-icon" />
                    </div>
                    {/* )} */}
                  </div>
                </div>
              ))}
          </div>
          {isToggleModalVisible && (
            <div>
              <label className="allow-location-modal">
                <div
                  className={isDarkMode ? 'allow-location-container' : 'd-allow-location-container'}
                >
                  <div className="allow-text-container">
                    <p className={isDarkMode ? 'allow-text' : 'd-allow-text'}>
                      Allow us to use your location to use Wave nearby.
                    </p>
                  </div>
                  <div className="location-allow-btn-container">
                    <button
                      className={isDarkMode ? 'decline-btn' : 'd-decline-btn'}
                      onClick={handleToggleModalClose}
                    >
                      Decline
                    </button>
                    <button
                      className={isDarkMode ? 'allow-btn' : 'd-allow-btn'}
                      onClick={handleAllowLocation}
                    >
                      Allow
                    </button>
                  </div>
                </div>
              </label>
            </div>
          )}

          {isLocationAllowed && (
            <div className="allow-location-modal">
              <div
                className={isDarkMode ? 'allow-location-container' : 'd-allow-location-container'}
              >
                <div className="choose-radius-container">
                  <p className={isDarkMode ? 'choose-radius' : 'd-choose-radius'}>
                    Choose a radius range
                  </p>
                </div>

                <div className="range-slider-container">
                  <Slider marks={marks} />
                </div>

                <div className="location-allow-btn-container">
                  <button
                    className={isDarkMode ? 'decline-btn' : 'd-decline-btn'}
                    onClick={handleLocationClose}
                  >
                    Cancel
                  </button>
                  <button className={isDarkMode ? 'allow-btn' : 'd-allow-btn'}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </>
  );
};

export default WaveNearby;
