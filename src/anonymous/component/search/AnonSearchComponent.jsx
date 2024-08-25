import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../../components/search/Search.module.css';
import { useTheme } from '../../../context/ThemeContext';
import { setAnonGlobalSearchScreen } from '../../../redux/slices/modalSlice';
import axios from 'axios';
import { BASE_URL, BEARER_TOKEN, DICCOVERCOMMUNITIES, GLOBALSERACH } from '../../../api/EndPoint';
import style from '../../../components/search/Search.module.css';
import { useNavigate } from 'react-router-dom';
import AnonSearchCompSkeleton from './AnonSearchCompSkeleton';

const AnonSearchComponent = () => {
  const inputRef = useRef(null); // Ref for input element
  const navigate = useNavigate();
  const { isDarkMode } = 'b';
  const dispatch = useDispatch();
  const [filterQuery, setFilterQuery] = useState('');
  const [fetchedAllCommunities, setFetchedAllCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]); // State to track joined communities
  const [fetchedCommunities, setFetchedCommunities] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state
  const [searchLoading, setSearchLoading] = useState(false); // Add a search loading state
  const searchTimeout = useRef(null); // Ref to store the search timeout

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        };
        const response = await axios.get(`${BASE_URL}${DICCOVERCOMMUNITIES}`, { headers });
        setFetchedCommunities(response.data.communities);

        // Initialize joined communities
        const initialJoinedCommunities = response.data.communities
          .filter((community) => community.isMember)
          .map((community) => community.name);
        setJoinedCommunities(initialJoinedCommunities);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
      try {
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        };
        const response = await axios.get(`${BASE_URL}${GLOBALSERACH}`, { headers });

        setFetchedAllCommunities(response.data.communities);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const getCommunitiesBySearch = (e) => {
    setFilterQuery(e.target.value);
    const filteredCommunities = fetchedAllCommunities.filter((community) =>
      community.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
    setFilteredCommunities(filteredCommunities);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const closeSearch = () => {
    dispatch(setAnonGlobalSearchScreen(false));
  };

  const goToCommunity = (name, status) => {
    navigate(`/anon/homepage/communities/${name}`);
  };

  return (
    <>
      <div className={isDarkMode ? styles.msgContainer : styles['d-msgContainer']}>
        <div className={isDarkMode ? 'searchContainers' : 'd-searchContainers'}>
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
                className={isDarkMode ? 'searchText_input' : 'd-searchText_input'}
                placeholder="Search anything here..."
                onChange={getCommunitiesBySearch}
                value={filterQuery}
                ref={inputRef}
              />
            </div>
          </div>

          <div className={styles.modalCloseContainer} onClick={closeSearch}>
            <img
              src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
              alt="close"
              className={styles.modalClose}
            />
          </div>
        </div>
        {searchLoading ? (
          <AnonSearchCompSkeleton />
        ) : (
          filterQuery.trim().length > 0 &&
          (filteredCommunities.length > 0 ? (
            <div className={style.searchPeopleContainer} style={{ marginLeft: '20px' }}>
              {filteredCommunities.map((community, index) => (
                <div
                  key={index}
                  onClick={() => goToCommunity(community.name)}
                  className={style.searchPeopleBox}
                >
                  <div className={style.searchProfilesContainer}>
                    <img
                      src={community.displayPicture}
                      className={style.searchProfile}
                      alt={`Profile of ${community.name}`}
                    ></img>
                  </div>
                  <div className={style.searchNameContainer}>
                    <p className={style.searchName} style={{ color: '#FCFCFC' }}>
                      {community.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>No results for "{filterQuery}"</p>
          ))
        )}
      </div>
    </>
  );
};

export default AnonSearchComponent;
