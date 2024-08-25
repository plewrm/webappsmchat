// import React from 'react';
// import search from '../../assets/icons/search.svg';
// import './Search.css';
// import { useTheme } from '../../context/ThemeContext';
// import lightSearch from '../../assets/icons/light-search.svg';
// import { useDispatch, useSelector } from 'react-redux';
// import { setMessageHomeScreen, setNotificationModal, closeWaveNearbyModal, setDiscoverView, setGlobalSearchScreen, setOpponentProfile } from '../../redux/slices/modalSlice';
// const Search = () => {
//     const dispatch = useDispatch()
//     const { isDarkMode } = useTheme();
//     const anonymousView = useSelector((state) => state.modal.anonymousView);

//     const openSearchScreen = () => {
//         dispatch(setGlobalSearchScreen(true))
//         dispatch(setMessageHomeScreen(false))
//         dispatch(setNotificationModal(false))
//         dispatch(closeWaveNearbyModal())
//         dispatch(setDiscoverView(false))
//         dispatch(setOpponentProfile(false))
//     }
//     const containerClass = anonymousView ? 'd-search-container' : isDarkMode ? 'search-container' : 'd-search-container';
//     const inputClass = anonymousView ? 'd-search-input' : isDarkMode ? 'search-input' : 'd-search-input';
//     const searchBarClass = anonymousView ? 'd-search-bar-container' : isDarkMode ? 'search-bar-container' : 'd-search-bar-container';
//     return (
//         <div>
//             <div className={containerClass} onClick={openSearchScreen}>
//                 <div className={searchBarClass}>
//                     <div className='search-icons-containers'>
//                         {isDarkMode ? <img src={lightSearch} alt='search' className='search-icons' /> : <img src={search} alt='search' className='search-icons' />}
//                     </div>
//                     <p className={inputClass} >Search Anything here...</p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Search;

import React from 'react';
import './Search.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMessageHomeScreen,
  setNotificationModal,
  closeWaveNearbyModal,
  setDiscoverView,
  setGlobalSearchScreen,
  setOpponentProfile
} from '../../redux/slices/modalSlice';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const anonymousView = useSelector((state) => state.anonView.anonymousView);
  // const navigate = useNavigate();
  const openSearchScreen = () => {
    dispatch(setGlobalSearchScreen(true));
    dispatch(setMessageHomeScreen(false));
    dispatch(setNotificationModal(false));
    dispatch(closeWaveNearbyModal());
    dispatch(setDiscoverView(false));
    dispatch(setOpponentProfile(false));
    // console.log(anonymousView)
    // if (anonymousView) {
    //   navigate('anon/discovers');
    // }
  };

  // Determine classes based on conditions
  const containerClass = anonymousView
    ? 'd-searchContainers'
    : isDarkMode
      ? 'searchContainers'
      : 'd-searchContainers';
  const boxClass = anonymousView ? 'd-searchBoxs' : isDarkMode ? 'searchBoxs' : 'd-searchBoxs';
  const textClass = anonymousView ? 'd-searchText' : isDarkMode ? 'searchText' : 'd-searchText';
  const iconSrc = isDarkMode ? '/lightIcon/searchLight.svg' : '/darkIcon/searchDark.svg';

  return (
    <div className={containerClass} onClick={openSearchScreen}>
      <div className={boxClass}>
        <div className="searchIconCOntainer">
          <img src={iconSrc} className="searchIcon" alt="icon" />
        </div>
        <div className="searchTextContainer">
          <p className={textClass}>Search users and hashtags</p>
        </div>
      </div>
    </div>
  );
};

export default Search;
