import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import leftBack from '../assets/icons/dark_mode_arrow_left.svg';
import './ShowFollowing.css';
import styles from '../components/messages/MsgHomeScreen.module.css';
import search from '../assets/icons/search.svg';
import axios from 'axios';
import {
  BASE_URL,
  BEARER_TOKEN,
  FOLLOWERS,
  FOLLOWING,
  FOLLOW_UNFOLLOW_USER,
  retrievedSoconId
} from '../api/EndPoint';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';
import HomeProfile from '../components/HomeProfile';
import defaultProfile from '../assets/icons/Default_pfp.webp';

const ShowFollowing = ({ closeFollowing, name, initialState, soconId, defaultTab }) => {
  const { isDarkMode } = useTheme();
  const [followersTab, setFollowersTab] = useState(defaultTab); // Set initial state with defaultTab value
  const navigate = useNavigate();

  const handleTabClick = (tabNumber) => {
    setFollowersTab(tabNumber);
  };

  const [follow, setFollow] = useState(initialState);
  const [followers, setFollowers] = useState(null);
  const [following, setfollowing] = useState(null);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [isFollowersLoading, setIsFollowersLoading] = useState(true);
  const [isFollowingLoading, setIsFollowingLoading] = useState(true);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      setIsFollowersLoading(true);
      setIsFollowingLoading(true);

      const res1 = await axios.get(`${BASE_URL}${FOLLOWERS}/${soconId}`, { headers });
      const res2 = await axios.get(`${BASE_URL}${FOLLOWING}/${soconId}`, { headers });
      // console.log(res1.data)
      // console.log(res2.data)
      setFollowers(res1.data.followers.users);
      setFilteredFollowers(res1.data.followers.users);
      setfollowing(res2.data.following.users);
      setFilteredFollowing(res2.data.following.users);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFollowersLoading(false);
      setIsFollowingLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [follow]);

  const unFollowUser = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${id}`, { headers });
      setFollow((prev) => !prev);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const followUser = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${id}`, {}, { headers });
      console.log(response.data);
      setFollow((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };
  const [openModal, setOpenModal] = useState(false);
  const [clickedSoconId, setClickedSococnId] = useState(null);
  const goToProfile = (soconId, username) => {
    navigate(`/profile/${username}/${soconId}`, { state: { soconId: soconId } });
    // setOpenModal(true)
    setClickedSococnId(soconId);
    closeFollowing();
    // navigate(`/profile/${username}`);
  };

  const getFollowingBySearch = (e) => {
    const filteredFollowing = following.filter((user) =>
      user.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredFollowing(filteredFollowing);
  };

  const getFollowerBySearch = (e) => {
    const filteredFollower = followers.filter((user) =>
      user.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredFollowers(filteredFollower);
  };

  return (
    <>
      <div className={isDarkMode ? 'showFollowing-container' : 'd-showFollowing-container'}>
        <div className="following-contains">
          <div className="leftBackContainer" onClick={closeFollowing}>
            <img
              src={isDarkMode ? '/lightIcon/arrowBackLight.svg' : '/darkIcon/arrowBackDark.svg'}
              alt="back"
              className="leftBack"
            />
          </div>
          <div className="self-Name-container">
            <p className={isDarkMode ? 'self-Name' : 'd-self-Name'}>{name}</p>
          </div>
        </div>

        <div className="followers-tab-container">
          <div
            className={isDarkMode ? 'followers-tab-box' : 'd-followers-tab-box'}
            onClick={() => handleTabClick(1)}
            style={{ borderBottom: followersTab === 1 ? '1px solid #BEBEC0' : '' }}
          >
            {followers && (
              <p className={isDarkMode ? 'followersTab' : 'd-follwoersTab'}>
                {followers.length} Followers
              </p>
            )}
          </div>
          <div
            className={isDarkMode ? 'followers-tab-box' : 'd-followers-tab-box'}
            onClick={() => handleTabClick(2)}
            style={{ borderBottom: followersTab === 2 ? '1px solid #BEBEC0' : '' }}
          >
            {following && (
              <p className={isDarkMode ? 'followersTab' : 'd-follwoersTab'}>
                {following.length} Following
              </p>
            )}
          </div>
        </div>

        {followersTab === 1 && (
          <>
            <div className="search-bar-follwing">
              {/* this search bar  css is in MsgHomeScreen.module.css */}
              <div className={styles.searchContainers}>
                <div className={isDarkMode ? styles.searchBar : styles['d-searchBar']}>
                  <div className={styles.searchIconContainer}>
                    <img
                      src={isDarkMode ? '/lightIcon/searchLight.svg' : '/darkIcon/searchDark.svg'}
                      alt="search"
                      className={styles.searchIcon}
                    />
                  </div>
                  <input
                    onChange={(e) => getFollowerBySearch(e)}
                    className={isDarkMode ? styles.inputSearch : styles['d-inputSearch']}
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
            {filteredFollowers.length === 0 ? (
              <p style={{ color: isDarkMode ? '#363636' : '#FCFCFC', textAlign: 'center' }}>
                No Followers
              </p>
            ) : (
              <div className="follwing-profiles-containers">
                {filteredFollowers.map((item, index) => (
                  <div className="following-profiles-box" key={index}>
                    <div className="followingProfilebox">
                      <img
                        src={item.pfp ? item.pfp : defaultProfile}
                        className="followingProfile"
                        alt="profile"
                      />
                    </div>

                    <div
                      onClick={() => goToProfile(item.soconId, item.username)}
                      className="following-name-box"
                    >
                      <div className="following-username-container">
                        <p className={isDarkMode ? 'following-username' : 'd-following-username'}>
                          {item.username}
                        </p>
                      </div>
                      <div className="following-name-container">
                        <p className={isDarkMode ? 'following-name' : 'd-following-name'}>
                          {item.display_name}
                        </p>
                      </div>
                    </div>

                    <div className="following-right-buttons">
                      {item.soconId ===
                      (retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')) ? (
                        <></>
                      ) : (
                        <>
                          {item.isFollowing ? (
                            <button
                              onClick={() => unFollowUser(item.soconId)}
                              className={isDarkMode ? 'followRemove-btns' : 'd-followRemove-btns'}
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              onClick={() => followUser(item.soconId)}
                              className="d-followBack-btns"
                            >
                              Follow
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {followersTab === 2 && (
          <>
            <div className="search-bar-follwing">
              {/* this search bar  css is in MsgHomeScreen.module.css */}
              <div className={styles.searchContainers}>
                <div className={isDarkMode ? styles.searchBar : styles['d-searchBar']}>
                  <div className={styles.searchIconContainer}>
                    <img src={search} alt="search" className={styles.searchIcon} />
                  </div>
                  <input
                    onChange={(e) => getFollowingBySearch(e)}
                    className={isDarkMode ? styles.inputSearch : styles['d-inputSearch']}
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
            {filteredFollowing.length === 0 ? (
              <p style={{ color: isDarkMode ? '#363636' : '#FCFCFC', textAlign: 'center' }}>
                No Followers
              </p>
            ) : (
              <div className="follwing-profiles-containers">
                {filteredFollowing.map((item, index) => (
                  <div className="following-profiles-box" key={index}>
                    <div className="followingProfilebox">
                      <img
                        src={item.pfp ? item.pfp : defaultProfile}
                        className="followingProfile"
                        alt="profile"
                      />
                    </div>

                    <div
                      onClick={() => goToProfile(item.soconId, item.username)}
                      className="following-name-box"
                    >
                      <div className="following-username-container">
                        <p className={isDarkMode ? 'following-username' : 'd-following-username'}>
                          {item.username}
                        </p>
                      </div>
                      <div className="following-name-container">
                        <p className={isDarkMode ? 'following-name' : 'd-following-name'}>
                          {item.display_name}
                        </p>
                      </div>
                    </div>

                    <div className="following-right-buttons">
                      {item.soconId ===
                      (retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')) ? (
                        <></>
                      ) : (
                        <>
                          {item.isFollowing ? (
                            <button
                              onClick={() => unFollowUser(item.soconId)}
                              className={isDarkMode ? 'followRemove-btns' : 'd-followRemove-btns'}
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              onClick={() => followUser(item.soconId)}
                              className="d-followBack-btns"
                            >
                              Follow
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ShowFollowing;
