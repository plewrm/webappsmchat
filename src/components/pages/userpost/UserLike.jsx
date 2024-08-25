import React, { useEffect, useState } from 'react';
import heart from '../../../assets/icons/heart.svg';
import close from '../../../assets/icons/modal-close.svg';
import './UserLike.css';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import { setUserLikeListModal } from '../../../redux/slices/modalSlice';
import search from '../../../assets/icons/search.svg';
import searchLight from '../../../assets/icons/light-search.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETALLLIKES,
  FOLLOWUSER,
  retrievedSoconId
} from '../../../api/EndPoint';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import HomeProfile from '../../HomeProfile';
import defaultProfile from '../../../assets/icons/Default_pfp.webp';
import { fetchFollowingUsers, followUser, unfollowUser } from '../../../redux/slices/postSlices';

const UserLike = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const [users, setUsers] = useState(null);
  const [filterUser, setFilterUser] = useState([]);
  const [searchName, setSearchName] = useState('');
  const status = useSelector((state) => state.posts.status);
  const followingUsers = useSelector((state) => state.posts.followingUsers);

  useEffect(() => {
    if (searchName) {
      const local = users
        .filter((user) => user.username.toLowerCase().includes(searchName.trim().toLowerCase()))
        .sort((a, b) => {
          const matchesA = (a.username.match(new RegExp(searchName, 'gi')) || []).length;
          const matchesB = (b.username.match(new RegExp(searchName, 'gi')) || []).length;
          return matchesB - matchesA; // Sort in descending order of matches
        });

      setFilterUser(local);
    }
  }, [searchName, users]);

  const getAllLikes = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(
        `${BASE_URL}${GETALLLIKES}${selectedPost.author.soconId}/${selectedPost.hash}`,
        { headers }
      );
      setUsers((prevState) => {
        if (response.data.likes) {
          return response.data.likes.users;
        }
        return prevState;
      });
      setFilterUser(response.data.likes.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async (userId, toFollow) => {
    try {
      console.log(toFollow);
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      toFollow
        ? await axios.post(`${BASE_URL}${FOLLOWUSER}${userId}`, {}, { headers })
        : await axios.delete(`${BASE_URL}${FOLLOWUSER}${userId}`, { headers });
      getAllLikes();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllLikes();
  }, []);

  const closeLikeUser = () => {
    dispatch(setUserLikeListModal(false));
  };

  // const handleFollowButtonClick = (userId, condition) => {
  //   handleFollow(userId, condition);
  //   const usersForFollow = [...users];
  //   const indexToUpdate = usersForFollow.findIndex((user) => user.soconId === userId);

  //   // Update the specific user's isFollowing property
  //   usersForFollow[indexToUpdate] = {
  //     ...usersForFollow[indexToUpdate],
  //     isFollowing: !usersForFollow[indexToUpdate].isFollowing
  //   };

  //   console.log(usersForFollow[indexToUpdate].isFollowing);
  //   setUsers(usersForFollow);
  // };

  const handleFollowButtonClick = (userId, isFollowing) => {
    try {
      if (isFollowing) {
        dispatch(unfollowUser(userId));
      } else {
        dispatch(followUser(userId));
      }
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.soconId === userId ? { ...user, isFollowing: !isFollowing } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const [profile, setProfile] = useState(null);
  const goToProfile = (item) => {
    setProfile(item.soconId);
    navigate(`/profile/${item.username}/${item.soconId}`, { state: { soconId: item.soconId } });
    dispatch(setUserLikeListModal(false));
  };

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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFollowingUsers());
    }
  }, [status, dispatch]);
  return (
    <div>
      {profile ? (
        <HomeProfile />
      ) : (
        <div
          className={isDarkMode ? 'like-user-modal-overlay' : 'd-like-user-modal-overlay'}
          onClick={closeLikeUser}
        >
          <div
            className={
              isDarkMode ? 'light-like-user-modal-content' : 'dark-like-user-modal-content'
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="like-user-header-box">
              <div className="liker-user-left-header">
                <div className="like-icon-container">
                  <img src={heart} alt="like" className="like-icon" />
                </div>
                <div className="like-title-container">
                  <p className={isDarkMode ? 'like-title' : 'd-like-title'}>Likes</p>
                </div>
              </div>
              {!isMobileView && (
                <div className="liker-user-right-header" onClick={closeLikeUser}>
                  <img src={close} className="like-user-close" />
                </div>
              )}
            </div>

            <div className={isDarkMode ? 'like-user-input-box' : 'd-like-user-input-box'}>
              <div className="like-search-icon-container">
                {isDarkMode ? (
                  <img src={searchLight} className="like-search-icon" alt="search" />
                ) : (
                  <img src={search} className="like-search-icon" alt="search" />
                )}
              </div>
              <div className="like-user-input-container">
                <input
                  placeholder="Search People here..."
                  type="text"
                  className={isDarkMode ? 'like-user-input' : 'd-like-user-input'}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            </div>

            <div className="like-user-count-container">
              {users && (
                <p className={isDarkMode ? 'like-user-count' : 'd-like-user-count'}>
                  Liked by {users.length}
                </p>
              )}
            </div>

            <div className={isDarkMode ? 'user-like-main-container' : 'd-user-like-main-container'}>
              {filterUser &&
                filterUser.map((user) => (
                  <div className="user-like-boxs" key={user.soconId}>
                    <div className="user-like-box-1">
                      <div className="user-like-image-container">
                        <img
                          src={user.pfp ? user.pfp : defaultProfile}
                          alt="image"
                          className="user-like-image"
                        />
                      </div>
                      <div onClick={() => goToProfile(user)} className="user-like-box-2">
                        <div className="user-like-name-container">
                          <p className={isDarkMode ? 'user-like-name' : 'd-user-like-name'}>
                            {user.display_name}
                          </p>
                        </div>
                        <div className="user-like-id-container">
                          <p className={isDarkMode ? 'user-like-id' : 'd-user-like-id'}>
                            {user.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="user-like-buttons">
                      {user.soconId !== retrievedSoconId && (
                        <button
                          className={isDarkMode ? 'like-user-following' : 'd-like-user-following'}
                          onClick={() =>
                            handleFollowButtonClick(
                              user.soconId,
                              followingUsers.includes(user.soconId)
                            )
                          }
                        >
                          {followingUsers.includes(user.soconId) ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>

                    {/* <div className="user-like-buttons">
                      {user.soconId != retrievedSoconId && user.isFollowing && (
                        <button
                          className={isDarkMode ? 'like-user-following' : 'd-like-user-following'}
                          onClick={() => handleFollow(user.soconId, false)}
                        >
                          Following
                        </button>
                      )}
                      {user.soconId != retrievedSoconId && !user.isFollowing && (
                        <button
                          className={isDarkMode ? 'like-user-follow' : 'd-like-user-follow'}
                          onClick={() => handleFollow(user.soconId, true)}
                        >
                          Follow
                        </button>
                      )}
                    </div> */}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLike;
