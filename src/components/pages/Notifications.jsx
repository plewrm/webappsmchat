import React, { useEffect, useState, useRef } from 'react';
import './Notification.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationModal } from '../../redux/slices/modalSlice';
import darkBack from '../../assets/icons/dark_mode_arrow_left.svg';
import lightBack from '../../assets/icons/light_mode_arrow_left.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETSUGGESTEDUSER,
  FOLLOW_UNFOLLOW_USER,
  GETALLNOTIFICATION,
  MARKNOTIFICATION,
  GETPOSTBYHASH
} from '../../api/EndPoint';
import { setSelectedPost } from '../../redux/slices/modalSlice';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDateForNoti } from '../../utils/time';
import liveIcon from '../../assets/icons/Ellipse 457.svg';
import HomeProfile from '../HomeProfile';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import NotificationSkeleton from './NotificationSkeleton';
const Notifications = () => {
  const [update, setUpdate] = useState(false);
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const currentTab = location.state && location.state.currentPage;
  const suggestedActiveTab = useSelector((state) => state.tabs.suggestedActiveTab);
  const [currentPage, setCurrentPage] = useState(
    suggestedActiveTab === true ? 1 : currentTab ? 1 : 0
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closeNotificationModal = () => {
    dispatch(setNotificationModal(false));
    navigate('/homepage');
  };
  const handlePage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

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
  const [loading, setLoading] = useState(false);
  const fetchNotification = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
  const markAsRead = async (notificationId, hash, soconId, username, userSoconId, action) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.patch(
        `${BASE_URL}${MARKNOTIFICATION}${notificationId}`,
        {},
        { headers }
      );
      setUpdate(true);
      if (action == 'follow') {
        dispatch(setNotificationModal(false));
        navigate(`/profile/${username}/${userSoconId}`, { state: { soconId: userSoconId } });
        // navigate(`/profile/rohit-178`)
      } else {
        getPostByHash(hash, soconId);
        dispatch(setNotificationModal(false));
        navigate(`/homepage/post/${hash}/${userSoconId}`);
      }
      // /homepage/post/:hash
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

  const hasNotifications = (notifications) => {
    return (
      notifications &&
      (notifications.today.length > 0 ||
        notifications.yesterday.length > 0 ||
        notifications.previous.length > 0)
    );
  };

  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  const updateVisibleCount = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const itemWidth = 140; // assuming each item has a width of 140px
      const count = Math.ceil(containerWidth / itemWidth);
      setVisibleCount(count);
    }
  };

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => {
      window.removeEventListener('resize', updateVisibleCount);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0); // Reset currentIndex when currentPage changes
    if (currentPage === 1) {
      updateVisibleCount(); // Trigger updateVisibleCount when switching to suggested users page
    }
  }, [currentPage]);

  const handleLeftClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRightClick = () => {
    if (currentIndex < suggestedUser.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      {
        // profile ? <HomeProfile /> :
        <div className={isDarkMode ? 'notification-container' : 'd-notification-container'}>
          {currentPage === 0 && (
            <>
              <div className="notification-header-outer">
                <div className="notification-header">
                  <div className="notification-back-container" onClick={closeNotificationModal}>
                    <img
                      src={
                        isDarkMode ? '/lightIcon/arrowBackLight.svg' : '/darkIcon/arrowBackDark.svg'
                      }
                      alt="back"
                      className="notification-back"
                    />
                  </div>
                  <div className="notification-title-container">
                    <p className={isDarkMode ? 'notification-title' : 'd-notification-title'}>
                      Notification
                    </p>
                  </div>
                </div>
              </div>

              <div className="notification-follow-request-container" onClick={() => handlePage(1)}>
                <div className="left-request-container">
                  <div className="request-photo-container-outer"></div>

                  <div className="follow-requests-text-container">
                    <p className={isDarkMode ? 'follow-requests-text' : 'd-follow-requests-text'}>
                      Suggested People
                    </p>
                  </div>
                </div>

                <div className="right-request-container">
                  <div className="request-box">
                    <div className="request-icons-container">
                      <img
                        src={'/icon/profileRequest.svg'}
                        alt="request"
                        className="request-icons"
                      />
                    </div>
                    <div className="request-count-container">
                      <p className={isDarkMode ? 'request-count' : 'd-request-count'}>
                        +{suggestedUser && suggestedUser.length}
                      </p>
                    </div>
                  </div>

                  <div className="right-arrow-notification-container">
                    <img
                      src={
                        isDarkMode
                          ? '/lightIcon/arrowRightLight.svg'
                          : '/darkIcon/arrowRightDark.svg'
                      }
                      alt="right"
                      className="right-arrow-notification"
                    />
                  </div>
                </div>
              </div>

              {loading && (
                <NotificationSkeleton />
                // <div className="loaderContainer">
                //   <div className={isDarkMode ? 'loader' : 'd-loader'}></div>
                // </div>
              )}

              <div className="incoming-notification-container">
                <>
                  {!loading && notifications && !hasNotifications(notifications) && (
                    <div className="no-notifications">
                      <p
                        className={isDarkMode ? 'no-notifications-text' : 'd-no-notifications-text'}
                      >
                        No New Notifications
                      </p>
                    </div>
                  )}
                </>
                <>
                  {notifications && notifications.today.length !== 0 && (
                    <div className="notification-day-container">
                      <p className={isDarkMode ? 'notification-day' : 'd-notification-day'}>New</p>
                    </div>
                  )}
                  <div className="outsidebox-Nf">
                    {notifications &&
                      notifications.today.map((item, index) => (
                        <div
                          onClick={() =>
                            markAsRead(
                              item.id,
                              item.post.hash,
                              item.post.soconid,
                              item.username,
                              item.soconId,
                              item.action
                            )
                          }
                          style={
                            !item.isRead
                              ? isDarkMode
                                ? { background: '#EFEDF8' }
                                : { background: '#161321' }
                              : {}
                          }
                          className="nf-outer-box"
                          key={item.id}
                        >
                          <div className="nf-profile-pic-container">
                            <img
                              src={item.pfp ? item.pfp : defaultProfile}
                              alt="picture"
                              className="nf-profile-pic"
                            />
                          </div>
                          <div className="nf-alltext-container">
                            <span className={isDarkMode ? 'username-nf' : 'd-username-nf'}>
                              {item.username}
                            </span>
                            <span className={isDarkMode ? 'mentioned-nf' : 'd-mentioned-nf'}>
                              {item.message}
                            </span>
                            <span className={isDarkMode ? 'time-nf' : 'd-time-nf'}>
                              {getDateForNoti(item.timestamp)}
                            </span>
                          </div>
                          <div className="nf-right-box">
                            {item.post.media && item.post.media.url && (
                              <div>
                                {item.post.media.type === 1 ? (
                                  <video
                                    className="noti-media"
                                    src={item.post.media.url}
                                    controls
                                  ></video>
                                ) : (
                                  <img
                                    className="noti-media"
                                    src={item.post.media.url}
                                    alt="media-icon"
                                  />
                                )}
                              </div>
                            )}
                            {!item.isRead && (
                              <div>
                                {/* <img src={liveIcon} className="nf-right-img" alt="image" /> */}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
                <>
                  {notifications && notifications.yesterday.length !== 0 && (
                    <div className="notification-day-container">
                      <p className={isDarkMode ? 'notification-day' : 'd-notification-day'}>
                        Yesterday
                      </p>
                    </div>
                  )}
                  <div className="outsidebox-Nf">
                    {notifications &&
                      notifications.yesterday.map((item, index) => (
                        <div
                          onClick={() =>
                            markAsRead(
                              item.id,
                              item.post.hash,
                              item.post.soconid,
                              item.username,
                              item.soconId,
                              item.action
                            )
                          }
                          style={
                            !item.isRead
                              ? isDarkMode
                                ? { background: '#EFEDF8' }
                                : { background: '#161321' }
                              : {}
                          }
                          className="nf-outer-box"
                          key={item.id}
                        >
                          {' '}
                          <div className="nf-profile-pic-container">
                            <img
                              src={item.pfp ? item.pfp : defaultProfile}
                              alt="picture"
                              className="nf-profile-pic"
                            />
                          </div>
                          <div className="nf-alltext-container">
                            <span className={isDarkMode ? 'username-nf' : 'd-username-nf'}>
                              {item.username}
                            </span>
                            <span className={isDarkMode ? 'mentioned-nf' : 'd-mentioned-nf'}>
                              {item.message}
                            </span>
                            <span className={isDarkMode ? 'time-nf' : 'd-time-nf'}>
                              {getDateForNoti(item.timestamp)}
                            </span>
                          </div>
                          <div className="nf-right-box">
                            {item.post.media && item.post.media.url && (
                              <div>
                                {item.post.media.type === 1 ? (
                                  <video
                                    className="noti-media"
                                    src={item.post.media.url}
                                    controls
                                  ></video>
                                ) : (
                                  <img
                                    className="noti-media"
                                    src={item.post.media.url}
                                    alt="media-icon"
                                  />
                                )}
                              </div>
                            )}
                            {!item.isRead && (
                              <div>
                                <img src={liveIcon} className="nf-right-img" alt="image" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
                <>
                  {notifications && notifications.previous.length !== 0 && (
                    <div className="notification-day-container">
                      <p className={isDarkMode ? 'notification-day' : 'd-notification-day'}>
                        Previous
                      </p>
                    </div>
                  )}
                  <div className="outsidebox-Nf">
                    {notifications &&
                      notifications.previous.map((item, index) => (
                        <div
                          onClick={() =>
                            markAsRead(
                              item.id,
                              item.post.hash,
                              item.post.soconid,
                              item.username,
                              item.soconId,
                              item.action
                            )
                          }
                          style={
                            !item.isRead
                              ? isDarkMode
                                ? { background: '#EFEDF8' }
                                : { background: '#161321' }
                              : {}
                          }
                          className="nf-outer-box"
                          key={item.id}
                        >
                          {' '}
                          <div className="nf-profile-pic-container">
                            <img
                              src={item.pfp ? item.pfp : defaultProfile}
                              alt="picture"
                              className="nf-profile-pic"
                            />
                          </div>
                          <div className="nf-alltext-container">
                            <span className={isDarkMode ? 'username-nf' : 'd-username-nf'}>
                              {item.username}
                            </span>
                            <span className={isDarkMode ? 'mentioned-nf' : 'd-mentioned-nf'}>
                              {item.message}
                            </span>
                            <span className={isDarkMode ? 'time-nf' : 'd-time-nf'}>
                              {getDateForNoti(item.timestamp)}
                            </span>
                          </div>
                          <div className="nf-right-box">
                            {item.post.media && item.post.media.url && (
                              <div>
                                {item.post.media.type === 1 ? (
                                  <video
                                    className="noti-media"
                                    src={item.post.media.url}
                                    controls
                                  ></video>
                                ) : (
                                  <img
                                    className="noti-media"
                                    src={item.post.media.url}
                                    alt="media-icon"
                                  />
                                )}
                              </div>
                            )}
                            {!item.isRead && (
                              <div>
                                <img src={liveIcon} className="n" alt="image" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              </div>
            </>
          )}

          {currentPage === 1 && (
            <>
              <div className="notification-header-outer">
                <div className="notification-header">
                  <div className="notification-back-container" onClick={() => handlePage(0)}>
                    {isDarkMode ? (
                      <img src={lightBack} alt="back" className="notification-back" />
                    ) : (
                      <img src={darkBack} alt="back" className="notification-back" />
                    )}
                  </div>
                  <div className="notification-title-container">
                    <p className={isDarkMode ? 'notification-title' : 'd-notification-title'}>
                      People you may follow
                    </p>
                  </div>
                </div>
                <div className="notificationCarouselControl">
                  {currentIndex === 0 ? (
                    <img src="/icon/leftCarousel.svg" />
                  ) : (
                    <img
                      onClick={handleLeftClick}
                      src="/icon/leftActive.svg"
                      style={{ cursor: 'pointer' }}
                    />
                  )}

                  {currentIndex >= (suggestedUser ? suggestedUser.length : 0) - visibleCount + 1 ? (
                    <img src="/icon/RightInactive.svg" />
                  ) : (
                    <img
                      onClick={handleRightClick}
                      src="/icon/rightCarousel.svg"
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
              </div>

              <div
                className={
                  isDarkMode
                    ? 'all-suggestion-card-outer-container'
                    : 'd-all-suggestion-card-outer-container'
                }
                ref={containerRef}
              >
                {suggestedUser &&
                  suggestedUser
                    .slice(currentIndex, currentIndex + visibleCount)
                    .map((item, index) => (
                      <div
                        onClick={() => getProfile(item)}
                        className={
                          isDarkMode ? 'suggestion-card-container' : 'd-suggestion-card-container'
                        }
                        key={index}
                      >
                        <div className="suggestion-profile-container">
                          <img
                            src={item.pfp ? item.pfp : defaultProfile}
                            alt="img"
                            className="suggestion-profile"
                          />
                        </div>
                        <div className="suggestion-username-containers">
                          <p
                            className={
                              isDarkMode ? 'suggestion-usernames' : 'd-suggestion-usernames'
                            }
                          >
                            {item.username}
                          </p>
                        </div>
                        <div className="suggestion-name-container">
                          <p className={isDarkMode ? 'suggestion-name' : 'd-suggestion-name'}>
                            {item.display_name}
                          </p>
                        </div>
                        {!item.isFollowing ? (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              followUser(item);
                            }}
                            className={
                              isDarkMode ? 'suggestion-follow-btn' : 'd-suggestion-follow-btn'
                            }
                          >
                            Follow
                          </button>
                        ) : (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              unFollowUser(item);
                            }}
                            className={
                              isDarkMode ? 'suggestion-follow-btn' : 'd-suggestion-follow-btn'
                            }
                            style={{ background: '#241E39' }}
                          >
                            Following
                          </button>
                        )}
                      </div>
                    ))}
              </div>
            </>
          )}
        </div>
      }
    </>
  );
};

export default Notifications;
