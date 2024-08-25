import React, { useEffect, useState } from 'react';
import styles from './SpinbuzzV2.module.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSpinbuzzNew,
  setSpinbuzzProfile,
  setSpinBuzzUser,
  incrementListIndex
} from '../../redux/slices/spinbuzzSlices';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import { mapOptions } from './style';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETUSERPROFILE,
  SPINBUZZ_USER,
  retrievedSoconId,
  FINDSPINBUZZPROFILELIGHT
} from '../../api/EndPoint';
import SpinbuzzProfile from './SpinbuzzProfile';
import axios from 'axios';

const SpinbuzzV2 = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const spinbuzzNew = useSelector((state) => state.spinbuzz.spinbuzzNew);
  const spinbuzzProfile = useSelector((state) => state.spinbuzz.spinbuzzProfile);
  const spinBuzzUser = useSelector((state) => state.spinbuzz.spinBuzzUser);
  const lastIndex = useSelector((state) => state.spinbuzz.lastIndex);
  const [locations, setLocations] = useState([]);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const closeSpinbuzzNew = () => {
    dispatch(setSpinbuzzNew(false));
  };

  const openSpinbuzzProfile = () => {
    dispatch(incrementListIndex());
    dispatch(setSpinbuzzProfile(true));
  };

  const fetchSpinBuzzUsers = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(
        `${BASE_URL}${FINDSPINBUZZPROFILELIGHT}?lastIndex=${lastIndex}`,
        { headers }
      );
      dispatch(setSpinBuzzUser(response.data.profile));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (spinbuzzProfile) {
      fetchSpinBuzzUsers();
    }
  }, [spinbuzzProfile, lastIndex]);

  const [userProfile, setUserProfile] = useState(null);

  const getMyProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(
        `${BASE_URL}${GETUSERPROFILE}${retrievedSoconId || sessionStorage.getItem('soconId')}`,
        { headers }
      );
      setUserProfile(response.data.profile);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  const fetchSpinBuzzUser = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${SPINBUZZ_USER}`, { headers });
      const userLocations = response.data.users.map((user) => ({
        lat: user.latitude,
        lng: user.longitude,
        image: user.pfp,
        compatibility: user.compatibility
      }));
      setLocations(userLocations);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (spinbuzzNew) {
      fetchSpinBuzzUser();
    }
  }, [spinbuzzNew]);

  const calculateBorderStyle = (compatibility) => {
    const percentage = compatibility.toFixed(2);
    const gradientColor = `conic-gradient(#ABEDF1 ${percentage}%, #646b76 ${percentage}% 100%)`;
    return {
      background: gradientColor
    };
  };

  return (
    <>
      <div className={isDarkMode ? styles.outerContainer : styles['d-outerContainer']}>
        <div
          className={isDarkMode ? styles.innerContainer : styles['d-innerContainer']}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={isDarkMode ? styles.header : styles['d-header']}>
            <div className={styles.closeIconContainer} onClick={closeSpinbuzzNew}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.closeIcon}
              />
            </div>
            <div className={styles.tittleContainer}>
              <p className={isDarkMode ? styles.tittle : styles['d-tittle']}>Spinbuzz</p>
            </div>
          </div>
          <LoadScript googleMapsApiKey="AIzaSyBBxI30RVs9ogbbIwMx80PpvzAJYBmumlg">
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              zoom={4}
              center={{ lat: 21.1458, lng: 79.0882 }}
              options={mapOptions}
            >
              {locations.map((location, index) => (
                <InfoWindow
                  key={index}
                  position={{ lat: location.lat, lng: location.lng }}
                  //   onMouseOver={() => setHoveredLocation(location)}
                  //   onMouseOut={() => setHoveredLocation(null)}
                >
                  <div className={styles.infoWindowContent}>
                    {hoveredLocation === location && (
                      <div className={styles.compatibilityText}>
                        <img src="/Images/compatibility.svg" />
                        {location.compatibility.toFixed(0)} %
                      </div>
                    )}
                    <div
                      className={styles.borderContainer}
                      onMouseEnter={() => setHoveredLocation(location)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    >
                      <div
                        className={styles.borderFill}
                        style={calculateBorderStyle(location.compatibility)}
                      ></div>
                      <img
                        src={location.image || defaultProfile}
                        alt="Location"
                        className={styles.locationImage}
                      />
                    </div>
                  </div>
                </InfoWindow>
              ))}
            </GoogleMap>
            <div className={styles.avatarImgContainer} onClick={openSpinbuzzProfile}>
              <img
                src={userProfile ? userProfile.pfp : defaultProfile}
                alt="avatar"
                className={styles.avatarImg}
              />
            </div>
          </LoadScript>
        </div>
      </div>
      {spinBuzzUser && spinbuzzProfile && <SpinbuzzProfile />}
    </>
  );
};

export default SpinbuzzV2;
