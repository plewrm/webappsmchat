import React, { useEffect, useState, useRef } from 'react';
import leftBack from '../../assets/icons/dark_mode_arrow_left.svg';
import leftBackLight from '../../assets/icons/light_mode_arrow_left.svg';
import Hash1 from '../../assets/icons/hash1.png';
import Hash2 from '../../assets/icons/hash2.png';
import Hash3 from '../../assets/icons/hash3.jpg';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Search.module.css';
import {
  setGlobalSearchScreen,
  setOpponentProfile,
  setShowFollowing
} from '../../redux/slices/modalSlice';
import profiles from '../../assets/images/profile-pic.png';
import modalClose from '../../assets/icons/modal-close.svg';
import close from '../../assets/icons/modal-close.svg';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import { BASE_URL, BEARER_TOKEN, SEARCHUSER, TAGSUGGESTIONS } from '../../api/EndPoint';
import axios from 'axios';
import Posts from '../pages/userpost/Posts';
import SearchSkeleton from './SearchSkeleton';

const SearchComponent = ({ searchByDiscover = false, discoverSearchValue, close }) => {
  const inputRef = useRef(null); // Ref for input element
  // console.log(searchByDiscover);
  // console.log(discoverSearchValue);
  const isScreenLarge = window.innerWidth > 500;
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  // const userProfile = useSelector((state)=>state.auth.userProfile)
  const closeSearchScreen = () => {
    dispatch(setGlobalSearchScreen(false));
    if (searchByDiscover) {
      close();
    }
  };

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(searchByDiscover ? discoverSearchValue : '');
  const [showTagPosts, setShowTagPosts] = useState(false);
  const [selectTag, setSelectTag] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [planeTag, setPlaneTag] = useState('');
  const hashTag = useSelector((state) => state.modal.hashTag);
  const [waitTime, setWaitTime] = useState(false);

  useEffect(() => {
    if (hashTag.trim().length > 0) {
      setSearch(hashTag);
      setPlaneTag(hashTag.slice(1));
      setSelectTag(true);
    }
  }, [hashTag]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getTagSuggestions = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${TAGSUGGESTIONS}${planeTag}`, { headers });
      setSuggestedTags(response.data.data.hashtags);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.trim());
    if (e.target.value.length > 0) {
      if (e.target.value[0] === '#') {
        setShowTagPosts(true);
        setPlaneTag(e.target.value.slice(1));
        getTagSuggestions();
      } else {
        setShowTagPosts(false);
        const debounce = (func, delay) => {
          let timeoutId;
          return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              func.apply(null, args);
            }, delay);
          };
        };

        const fetchUsers = async (searchQuery) => {
          setWaitTime(true);
          try {
            const headers = {
              Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            };
            const response = await axios.get(`${BASE_URL}${SEARCHUSER}${searchQuery}`, { headers });
            setUsers(response.data.users);
            // console.log(response.data.users);
            setWaitTime(false);
          } catch (error) {
            console.error(error);
          }
        };
        const debouncedFetchUsers = debounce(fetchUsers, 1000);
        debouncedFetchUsers(e.target.value.trim());
      }
    } else {
      // Clear users when search text is empty
      setUsers([]);
    }
  };

  const [profile, setProfile] = useState(null);
  const goToProfile = (item) => {
    dispatch(setShowFollowing(false));
    setProfile(item.soconId);
    navigate(`/profile/${item.username}/${item.soconId}`, { state: { soconId: item.soconId } });
    dispatch(setGlobalSearchScreen(false));
  };

  return (
    <>
      <div className={isDarkMode ? styles.msgContainer : styles['d-msgContainer']}>
        <div className={isDarkMode ? 'searchContainers' : 'd-searchContainers'}>
          {!isScreenLarge && (
            <img src={isDarkMode ? leftBackLight : leftBack} onClick={closeSearchScreen} />
          )}
          <div className={isDarkMode ? 'searchBoxs' : 'd-searchBoxs'}>
            <div className="searchIconCOntainer">
              <img
                src={isDarkMode ? '/lightIcon/searchLight.svg' : '/darkIcon/searchDark.svg'}
                className="searchIcon"
                alt="icon"
              />
            </div>
            <div className="searchTextContainer_input">
              <input
                ref={inputRef}
                className={isDarkMode ? 'searchText_input' : 'd-searchText_input'}
                placeholder="Search anything here..."
                onChange={(e) => handleSearch(e)}
                value={search}
              />
            </div>
          </div>
          {isScreenLarge && (
            <div className={styles.modalCloseContainer} onClick={closeSearchScreen}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.modalClose}
              />
            </div>
          )}
        </div>

        {/* <div className={styles.searchContainers}>
          <div className={isDarkMode ? styles.searchBar : styles['d-searchBar']}>
            <div className={styles.searchIconContainer}>
              {isDarkMode ? <img src={searchImgLight} alt='search' className={styles.searchIcon} /> : <img src={searchImg} alt='search' className={styles.searchIcon} />}
            </div>
            <input onChange={(e) => handleSearch(e)} value={search} className={isDarkMode ? styles.inputSearch : styles['d-inputSearch']} placeholder='Search Anything here...' />
          </div>
        </div> */}

        <div className={styles.sideGap}>
          <div className={styles.recentContainer}>
            {/* <p className={isDarkMode ? styles.recentText : styles['d-recentText']}>Recent</p> */}
          </div>
          {waitTime && <SearchSkeleton />}
          {selectTag ? (
            <Posts
              hide={() => {
                setSelectTag(false);
              }}
              isHashTag={true}
              postByHashtag={planeTag}
            />
          ) : (
            <>
              {showTagPosts ? (
                // <Posts isHashTag={true} postByHashtag={search} />
                <div className="tag-list">
                  {suggestedTags &&
                    suggestedTags.map((tag, index) => (
                      <div
                        key={index}
                        className="suggested-tag"
                        //  style={{ backgroundColor: '#FCFCFC' }}
                      >
                        <span
                          onClick={() => {
                            setSelectTag(true);
                            setPlaneTag(tag.hashtag);
                            setSearch(`#${tag.hashtag}`);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: isDarkMode ? 'white' : 'black'
                          }}
                        >
                          <img src={isDarkMode ? Hash1 : Hash3} alt="No img" width="10%" />{' '}
                          <div style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp; #{tag.hashtag}
                          </div>
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className={styles.searchPeopleContainer}>
                  {users &&
                    users.map((item, index) => (
                      <div className={styles.searchPeopleBox} key={index}>
                        <div
                          className={styles.searchProfilesContainer}
                          onClick={() => goToProfile(item)}
                        >
                          <img
                            src={item.pfp ? item.pfp : defaultProfile}
                            alt="profile"
                            className={styles.searchProfile}
                          />
                        </div>
                        <div
                          onClick={() => goToProfile(item)}
                          className={styles.searchNameContainer}
                          style={{ display: 'flex', gap: '1vw' }}
                        >
                          {item.display_name ? (
                            <p className={isDarkMode ? styles.searchName : styles['d-searchName']}>
                              {item.display_name}
                            </p>
                          ) : (
                            ''
                          )}
                          {item.username ? (
                            <p
                              className={isDarkMode ? styles.searchName : styles['d-searchName']}
                              onClick={() => goToProfile(item)}
                            >
                              @{item.username}
                            </p>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
