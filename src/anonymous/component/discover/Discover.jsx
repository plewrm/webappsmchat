import React, { useEffect, useState, useRef } from 'react';
import styles from './Discover.module.css';
import style from '../../../components/search/Search.module.css';
import DiscoverComponent from './DiscoverComponent';
import search from '../../../assets/anonymous/icon/search-normal.svg';
import leftBack from '../../../assets/icons/dark_mode_arrow_left.svg';
import leftBackLight from '../../../assets/icons/arrow-left-lightMode.svg';
import CreateCommunity from './CreateCommunity';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setCommunityName, setCommunityStatus } from '../../../redux/slices/anonSlices';
import { setOpenCommunity } from '../../../redux/slices/modalSlice';
import { fetchCommunities } from '../../../redux/slices/anonSlices';

export default function Discover() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [handle, setHandle] = useState(true);
  const openCommunity = useSelector((state) => state.modal.openCommunity);
  const { isDarkMode } = useTheme();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);

  const fetchedCommunities = useSelector((state) => state.community.communities);
  const loading = useSelector((state) => state.community.loading);
  const error = useSelector((state) => state.community.error);
  const joinedCommunities = useSelector((state) => state.community.joinedCommunities); // Added

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOpenCommunity = () => {
    dispatch(setOpenCommunity(true));
  };
  const handleCloseCommunity = () => {
    dispatch(setOpenCommunity(false));
  };

  const handleCommunityClick = () => {
    setHandle(false);
  };

  const [filterQuery, setFilterQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState([]);

  useEffect(() => {
    setFilteredCommunities(
      fetchedCommunities.filter((community) =>
        community.name.toLowerCase().includes(filterQuery.toLowerCase())
      )
    );
  }, [filterQuery, fetchedCommunities]);

  const goToCommunity = (name) => {
    navigate(`/anon/homepage/communities/${name}`);
  };

  const getCommunitiesBySearch = (e) => {
    setFilterQuery(e.target.value);
  };

  const handleMobileBack = () => {
    navigate('/anon/homepage');
  };

  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const itemWidth = 140; // assuming each item has a width of 140px
        const count = Math.ceil(containerWidth / itemWidth);
        setVisibleCount(count);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => {
      window.removeEventListener('resize', updateVisibleCount);
    };
  }, []);

  const handleLeftClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRightClick = () => {
    if (currentIndex < fetchedCommunities.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      {isMobileView && (
        <div className={'d-mobileBackContainer'}>
          <div className="leftBackContainer" onClick={handleMobileBack}>
            <img src={leftBack} alt="back" className="leftBack" />
          </div>
          <div className="mobileBackTittleContainer">
            <p className={'d-mobileBackTittle'}>Discovers</p>
          </div>
        </div>
      )}
      {handle ? (
        <>
          {!openCommunity && (
            <div className={styles.Discover}>
              <div className={styles.DiscoverContainer}>
                <div className={styles.Header}>
                  <p className={styles.tittles}>Community</p>
                  <button onClick={handleOpenCommunity} className={styles.createCommunityBtn}>
                    Create Community
                  </button>
                </div>
                <div className={styles.body}>
                  <div className={styles.element_0}>
                    <div className={styles.headerBox}>
                      <div className={styles.searchBox}>
                        <img src={search} alt="search-icon" />
                        <input
                          onChange={getCommunitiesBySearch}
                          value={filterQuery}
                          type="text"
                          placeholder="Search anything here..."
                        />
                      </div>
                    </div>
                  </div>

                  {loading && (
                    <div className="loaderContainer">
                      <div className={'loader'}></div>
                    </div>
                  )}

                  {filterQuery.trim().length > 0 ? (
                    filteredCommunities.length > 0 ? (
                      <div className={style.searchPeopleContainer}>
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
                      <p style={{ textAlign: 'center', color: '#888' }}>
                        No results for "{filterQuery}"
                      </p>
                    )
                  ) : (
                    <>
                      {fetchedCommunities.length > 0 ? (
                        <div className={styles.btnControl}>
                          {currentIndex === 0 ? (
                            <img src="/icon/leftCarousel.svg" alt="Left Carousel" />
                          ) : (
                            <img
                              onClick={handleLeftClick}
                              src="/icon/leftActive.svg"
                              style={{ cursor: 'pointer' }}
                              alt="Left Active"
                            />
                          )}
                          {currentIndex >= fetchedCommunities.length - visibleCount + 1 ? (
                            <img src="/icon/RightInactive.svg" alt="Right Inactive" />
                          ) : (
                            <img
                              onClick={handleRightClick}
                              src="/icon/rightCarousel.svg"
                              style={{ cursor: 'pointer' }}
                              alt="Right Carousel"
                            />
                          )}
                        </div>
                      ) : (
                        <p style={{ color: '#FCFCFC', textAlign: 'center' }}>
                          No suggestions found
                        </p>
                      )}

                      <div className={styles.element_1} ref={containerRef}>
                        {fetchedCommunities &&
                          fetchedCommunities
                            .slice(currentIndex, currentIndex + visibleCount)
                            .map((community, index) => (
                              <span key={index}>
                                <DiscoverComponent
                                  close={() => setHandle(false)}
                                  content={community}
                                  joinedCommunities={joinedCommunities} // Pass joinedCommunities to DiscoverComponent
                                />
                              </span>
                            ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {openCommunity && <CreateCommunity handleClose={handleCloseCommunity} />}
        </>
      ) : (
        <EachCommunity closeCommunity={() => setHandle(true)} />
      )}
    </>
  );
}

// import React, { useEffect, useState, useRef } from 'react';
// import styles from './Discover.module.css';
// import style from '../../../components/search/Search.module.css';
// import DiscoverComponent from './DiscoverComponent';
// import search from '../../../assets/anonymous/icon/search-normal.svg';
// import leftBack from '../../../assets/icons/dark_mode_arrow_left.svg';
// import leftBackLight from '../../../assets/icons/arrow-left-lightMode.svg';
// import CreateCommunity from './CreateCommunity';
// import { useNavigate } from 'react-router-dom';
// import { useTheme } from '../../../context/ThemeContext';
// import { useDispatch, useSelector } from 'react-redux';
// import { setCommunityName, setCommunityStatus } from '../../../redux/slices/anonSlices';
// import { setOpenCommunity } from '../../../redux/slices/modalSlice';
// import { fetchCommunities } from '../../../redux/slices/anonSlices';

// export default function Discover() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [handle, setHandle] = useState(true);
//   const openCommunity = useSelector((state) => state.modal.openCommunity);
//   const { isDarkMode } = useTheme();
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);

//   const fetchedCommunities = useSelector((state) => state.community.communities);
//   const loading = useSelector((state) => state.community.loading);
//   const error = useSelector((state) => state.community.error);
//   const joinedCommunities = useSelector((state) => state.community.joinedCommunities);

//   useEffect(() => {
//     dispatch(fetchCommunities());
//   }, [dispatch]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth <= 500);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const handleOpenCommunity = () => {
//     dispatch(setOpenCommunity(true));
//   };
//   const handleCloseCommunity = () => {
//     dispatch(setOpenCommunity(false));
//   };

//   const handleCommunityClick = () => {
//     setHandle(false);
//   };

//   const [filterQuery, setFilterQuery] = useState('');
//   const [filteredCommunities, setFilteredCommunities] = useState([]);

//   useEffect(() => {
//     setFilteredCommunities(
//       fetchedCommunities.filter((community) =>
//         community.name.toLowerCase().includes(filterQuery.toLowerCase())
//       )
//     );
//   }, [filterQuery, fetchedCommunities]);

//   const goToCommunity = (name) => {
//     navigate(`/anon/homepage/communities/${name}`);
//   };

//   const getCommunitiesBySearch = (e) => {
//     setFilterQuery(e.target.value);
//   };

//   const handleMobileBack = () => {
//     navigate('/anon/homepage');
//   };

//   const containerRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [visibleCount, setVisibleCount] = useState(0);

//   useEffect(() => {
//     const updateVisibleCount = () => {
//       if (containerRef.current) {
//         const containerWidth = containerRef.current.offsetWidth;
//         const itemWidth = 140;
//         const count = Math.ceil(containerWidth / itemWidth);
//         setVisibleCount(count);
//       }
//     };

//     updateVisibleCount();
//     window.addEventListener('resize', updateVisibleCount);

//     return () => {
//       window.removeEventListener('resize', updateVisibleCount);
//     };
//   }, []);

//   const handleLeftClick = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   const handleRightClick = () => {
//     if (currentIndex < fetchedCommunities.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.discoverHeader}>
//         {isMobileView ? (
//           <div onClick={handleMobileBack}>
//             <img src={isDarkMode ? leftBack : leftBackLight} alt="back" />
//           </div>
//         ) : null}
//         <p className={styles.discoverTitle}>Discover</p>
//         <div className={style.searchContainer}>
//           <img src={search} alt="search" />
//           <input
//             type="text"
//             value={filterQuery}
//             onChange={getCommunitiesBySearch}
//             className={style.search}
//             placeholder="Search"
//           />
//         </div>
//       </div>
//       <div className={styles.middleSection}>
//         <p className={styles.middleSectionTitle}>Suggested Communities</p>
//         <div className={styles.suggested}>
//           {loading ? (
//             <p>Loading...</p>
//           ) : error ? (
//             <p>{error}</p>
//           ) : filteredCommunities.length > 0 ? (
//             <>
//               {currentIndex > 0 && (
//                 <button onClick={handleLeftClick} className={styles.leftButton}>
//                   &#60;
//                 </button>
//               )}
//               <div ref={containerRef} className={styles.suggestedContainer}>
//                 {filteredCommunities
//                   .slice(currentIndex, currentIndex + visibleCount)
//                   .map((community, index) => (
//                     <DiscoverComponent
//                       key={community.name}
//                       community={community}
//                       goToCommunity={goToCommunity}
//                       handleCommunityClick={handleCommunityClick}
//                       joined={joinedCommunities.includes(community.name)}
//                     />
//                   ))}
//               </div>
//               {currentIndex < fetchedCommunities.length - visibleCount && (
//                 <button onClick={handleRightClick} className={styles.rightButton}>
//                   &#62;
//                 </button>
//               )}
//             </>
//           ) : (
//             <p>No communities found</p>
//           )}
//         </div>
//       </div>
//       <div className={styles.createCommunity} onClick={handleOpenCommunity}>
//         Create Community
//       </div>
//       {openCommunity && (
//         <CreateCommunity onClose={handleCloseCommunity} />
//       )}
//     </div>
//   );
// }
