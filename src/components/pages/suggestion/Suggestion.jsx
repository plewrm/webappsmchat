import React, { useEffect, useState } from 'react';
import styles from './Suggestion.module.css';
import { useTheme } from '../../../context/ThemeContext';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETSUGGESTEDUSER,
  FOLLOW_UNFOLLOW_USER,
  GETALLNOTIFICATION,
  GETPOSTBYHASH
} from '../../../api/EndPoint';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNotificationModal, setSelectedPost } from '../../../redux/slices/modalSlice';
import defaultPfp from '../../../assets/icons/Default_pfp.webp';
const Suggestion = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const [suggestedUser, setSuggestedUser] = useState(null);
  const getSuggestedUser = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETSUGGESTEDUSER}`, { headers });
      response.data.users.forEach((user) => {
        user.isFollowing = false;
      });
      setSuggestedUser(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const [notifications, setNotifications] = useState(null);
  const fetchNotification = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${GETALLNOTIFICATION}`, { headers });
      // console.log(response.data)
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotification();
    getSuggestedUser();
  }, [update]);

  const followUser = async (item) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${BASE_URL}${FOLLOW_UNFOLLOW_USER}${item.soconId}`,
        {},
        { headers }
      );
      // console.log(response.data);
      setSuggestedUser((list) =>
        list.map((element) =>
          element.soconId === item.soconId
            ? { ...element, isFollowing: !element.isFollowing }
            : element
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const unFollowUser = async (item) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${item.soconId}`, {
        headers
      });
      console.log(response.data);
      setSuggestedUser((list) =>
        list.map((element) =>
          element.soconId === item.soconId
            ? { ...element, isFollowing: !element.isFollowing }
            : element
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getPostByHash = async (hash, soconId) => {
    //setSelectedPost
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETPOSTBYHASH}${soconId}/${hash}`, {
        headers
      });
      dispatch(setSelectedPost(response.data.post));
    } catch (error) {
      console.error(error);
    }
  };

  const [profile, setProfile] = useState(null);
  const getProfile = (item) => {
    navigate(`/profile/${item.username}/${item.soconId}`, { state: { soconId: item.soconId } });
    dispatch(setNotificationModal(false));
    setProfile(item.soconId);
  };

  const handleSeeAllClick = () => {
    navigate('/notifications', { state: { currentPage: 1 } });
  };

  return (
    <div className={isDarkMode ? styles.suggestionContainer : styles['d-suggestionContainer']}>
      <div className={styles.suggestionHeader}>
        <div className={styles.titleLeftContainer}>
          <p className={isDarkMode ? styles.titleLeft : styles['d-titleLeft']}>
            People you may Follow
          </p>
        </div>
        <div className={styles.titleRightContainer} onClick={handleSeeAllClick}>
          <p className={styles.titleRight}>See All</p>
        </div>
      </div>
      <div className={styles.suggestionPeopleContainer}>
        {suggestedUser &&
          suggestedUser.slice(0, 3).map((item, index) => (
            <div className={styles.suggestionBox} onClick={() => getProfile(item)}>
              <div className={styles.peopleImgContainer}>
                {item.pfp ? (
                  <img src={item.pfp} alt="img" className={styles.peopleImg} />
                ) : (
                  <img src={defaultPfp} alt="img" className={styles.peopleImg} />
                )}
              </div>

              <div className={styles.peopleInfoContainer}>
                <div className={styles.peopleNameContainer}>
                  <p className={isDarkMode ? styles.peopleName : styles['d-peopleName']}>
                    {item.display_name}
                  </p>
                </div>
                <div className={styles.peopleUserNameContainer}>
                  <p className={isDarkMode ? styles.peopleUserName : styles['d-peopleUserName']}>
                    {item.username}
                  </p>
                </div>
              </div>

              {!item.isFollowing ? (
                <button
                  onClick={(event) => {
                    followUser(item);
                    event.stopPropagation();
                  }}
                  className={isDarkMode ? styles.actionButton : styles['d-actionButton']}
                >
                  Follow
                </button>
              ) : (
                <button
                  onClick={(event) => {
                    unFollowUser(item);
                    event.stopPropagation();
                  }}
                  className={isDarkMode ? styles.actionButton : styles['d-actionButton']}
                >
                  Following
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Suggestion;
