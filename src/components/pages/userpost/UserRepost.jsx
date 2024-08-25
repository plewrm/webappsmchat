import React, { useEffect, useState } from 'react';
import heart from '../../../assets/icons/heart.svg';
import close from '../../../assets/icons/modal-close.svg';
import './UserLike.css';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import { setUserRepostListModal } from '../../../redux/slices/modalSlice';
import search from '../../../assets/icons/search.svg';
import DarkSearch from '../../../assets/icons/searchDark.svg';
import profile from '../../../assets/images/message-user (4).png';
import {
  BASE_URL,
  BEARER_TOKEN,
  REPOST,
  FOLLOWUSER,
  retrievedSoconId
} from '../../../api/EndPoint';
import axios from 'axios';
import { useSelector } from 'react-redux';
import UserProfile from '../../../modals/UserProfile';
import { useNavigate } from 'react-router-dom';
import HomeProfile from '../../HomeProfile';

const UserRepost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const [resposts, setReposts] = useState(null);
  const getAllReposts = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(
        `${BASE_URL}${REPOST}${selectedPost.author.soconId}/${selectedPost.hash}`,
        { headers }
      );
      console.log(response.data);
      setReposts(response.data.reposts);
    } catch (error) {
      console.error(error);
    }
  };
  const handleFollow = async (toFollow) => {
    try {
      console.log(toFollow);
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      toFollow
        ? await axios.post(
            `${BASE_URL}${FOLLOWUSER}${selectedPost.author.soconId}`,
            {},
            { headers }
          )
        : await axios.delete(`${BASE_URL}${FOLLOWUSER}${selectedPost.author.soconId}`, { headers });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllReposts();
  }, []);
  const closeRepostModal = () => {
    dispatch(setUserRepostListModal(false));
  };

  const handleFollowButtonClick = (userId) => {
    handleFollow(!resposts.filter((user) => user.soconId === userId)[0].isFollowing);
    const respostsForFollow = [...resposts];
    const indexToUpdate = respostsForFollow.findIndex((user) => user.soconId === userId);

    // Update the specific user's isFollowing property
    respostsForFollow[indexToUpdate] = {
      ...respostsForFollow[indexToUpdate],
      isFollowing: !respostsForFollow[indexToUpdate].isFollowing
    };

    console.log(respostsForFollow[indexToUpdate].isFollowing);
    setReposts(respostsForFollow);
  };
  const [profile, setProfile] = useState(null);
  const gotToProfile = (item) => {
    // console.log(item)
    setProfile(item.soconId);
    // navigate(`/profile/${item.childPost.author.username}`)
    navigate(`/profile/${item.childPost.author.username}/${item.childPost.author.soconId}`, {
      state: { soconId: item.childPost.author.soconId }
    });
    dispatch(setUserRepostListModal(false));
  };

  return (
    <div>
      {profile ? (
        <HomeProfile />
      ) : (
        <div className={isDarkMode ? 'like-user-modal-overlay' : 'd-like-user-modal-overlay'}>
          <div
            className={
              isDarkMode ? 'light-like-user-modal-content' : 'dark-like-user-modal-content'
            }
          >
            <div className="like-user-header-box">
              <div className="liker-user-left-header">
                <div className="like-icon-container">
                  <img src={heart} alt="like" className="like-icon" />
                </div>
                <div className="like-title-container">
                  <p className={isDarkMode ? 'like-title' : 'd-like-title'}>Reposts</p>
                </div>
              </div>
              <div className="liker-user-right-header" onClick={closeRepostModal}>
                <img src={close} className="like-user-close" />
              </div>
            </div>

            <div className={isDarkMode ? 'like-user-input-box' : 'd-like-user-input-box'}>
              <div className="like-search-icon-container">
                <img src={search} className="like-search-icon" />
              </div>
              <div className="like-user-input-container">
                <input
                  placeholder="Search People here..."
                  type="text"
                  className={isDarkMode ? 'like-user-input' : 'd-like-user-input'}
                />
              </div>
            </div>

            <div className="like-user-count-container">
              {resposts && (
                <p className={isDarkMode ? 'like-user-count' : 'd-like-user-count'}>
                  Reposted by {resposts.length}
                </p>
              )}
            </div>

            <div className={isDarkMode ? 'user-like-main-container' : 'd-user-like-main-container'}>
              {resposts &&
                resposts.map((user) => (
                  <div className="user-like-boxs" key={user.soconId}>
                    <div className="user-like-box-1">
                      <div className="user-like-image-container">
                        <img src={user.author.pfp} alt="image" className="user-like-image" />
                      </div>
                      <div onClick={() => gotToProfile(user)} className="user-like-box-2">
                        <div className="user-like-name-container">
                          <p className={isDarkMode ? 'user-like-name' : 'd-user-like-name'}>
                            {user.author.display_name}
                          </p>
                        </div>
                        <div className="user-like-id-container">
                          <p className={isDarkMode ? 'user-like-id' : 'd-user-like-id'}>
                            {user.author.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="user-like-buttons">
                      {user.author.soconId != retrievedSoconId && user.isFollowing && (
                        <button
                          className={isDarkMode ? 'like-user-following' : 'd-like-user-following'}
                          onClick={() => handleFollowButtonClick(user.soconId)}
                        >
                          Following
                        </button>
                      )}
                      {user.author.soconId != retrievedSoconId && !user.isFollowing && (
                        <button
                          className={isDarkMode ? 'like-user-follow' : 'd-like-user-follow'}
                          onClick={() => handleFollowButtonClick(user.soconId)}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRepost;
