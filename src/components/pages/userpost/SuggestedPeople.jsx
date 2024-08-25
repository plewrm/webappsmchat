import axios from 'axios';
import defaultProfile from '../../../assets/icons/Default_pfp.webp';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { BASE_URL, BEARER_TOKEN, GETSUGGESTEDUSER } from '../../../api/EndPoint';
import { fetchFollowingUsers, followUser, unfollowUser } from '../../../redux/slices/postSlices';
import { useTheme } from '../../../context/ThemeContext';
import './PostContainer.css';
import './Posts.css';

const SuggestedPeople = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const followingUsers = useSelector((state) => state.posts.followingUsers);
  const status = useSelector((state) => state.posts.status);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suggestedUser, setSuggestedUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [firstLogin, setFirstLogin] = useState(localStorage.getItem('firstLogin'));

  //refer

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

  const getProfile = (item) => {
    navigate(`/profile/${item.username}/${item.soconId}`, { state: { soconId: item.soconId } });
    // dispatch(setNotificationModal(false));
    // setProfile(item.soconId);
  };

  const updateVisibleCount = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const itemWidth = 140;
      const count = Math.ceil(containerWidth / itemWidth);
      setVisibleCount(count);
    }
  };

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

  const isFollowingUser = (authorSoconId) => {
    return followingUsers.includes(authorSoconId);
  };

  const followUserDiscover = (authorSoconId) => {
    console.log('follow in posts');
    dispatch(followUser(authorSoconId));
  };

  const unFollowUserDiscover = (authorSoconId) => {
    console.log('unfollow in posts');
    dispatch(unfollowUser(authorSoconId));
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFollowingUsers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    getSuggestedUser();
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => {
      window.removeEventListener('resize', updateVisibleCount);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    updateVisibleCount();
  }, []);

  return (
    <>
      <div className="notification-header-outer">
        <div className="notification-header">
          <div className="notification-back-container"></div>
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
          suggestedUser.slice(currentIndex, currentIndex + visibleCount).map((item, index) => (
            <div
              onClick={() => getProfile(item)}
              className={isDarkMode ? 'suggestion-card-container' : 'd-suggestion-card-container'}
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
                <p className={isDarkMode ? 'suggestion-usernames' : 'd-suggestion-usernames'}>
                  {item.username}
                </p>
              </div>
              <div className="suggestion-name-container">
                <p className={isDarkMode ? 'suggestion-name' : 'd-suggestion-name'}>
                  {item.display_name}
                </p>
              </div>
              {!isFollowingUser(item.soconId) ? (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    followUserDiscover(item.soconId);
                  }}
                  className={isDarkMode ? 'suggestion-follow-btn' : 'd-suggestion-follow-btn'}
                >
                  Follow
                </button>
              ) : (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    unFollowUserDiscover(item.soconId);
                  }}
                  className={isDarkMode ? 'suggestion-follow-btn' : 'd-suggestion-follow-btn'}
                  style={{ background: '#241E39' }}
                >
                  Following
                </button>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default SuggestedPeople;
