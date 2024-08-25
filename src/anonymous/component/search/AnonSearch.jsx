import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import { setAnonGlobalSearchScreen } from '../../../redux/slices/modalSlice';

const AnonSearch = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const anonGlobalSearchScreen = useSelector((state) => state.modal.anonGlobalSearchScreen);
  const anonymousView = useSelector((state) => state.anonView.anonymousView);

  const containerClass = anonymousView
    ? 'd-searchContainers'
    : isDarkMode
      ? 'searchContainers'
      : 'd-searchContainers';
  const boxClass = anonymousView ? 'd-searchBoxs' : isDarkMode ? 'searchBoxs' : 'd-searchBoxs';
  const textClass = anonymousView ? 'd-searchText' : isDarkMode ? 'searchText' : 'd-searchText';
  const iconSrc = '/darkIcon/searchDark.svg';

  return (
    <div className={containerClass} onClick={() => dispatch(setAnonGlobalSearchScreen(true))}>
      <div className={boxClass}>
        <div className="searchIconCOntainer">
          <img src={iconSrc} className="searchIcon" alt="icon" />
        </div>
        <div className="searchTextContainer">
          <p className={textClass}>Search Community</p>
        </div>
      </div>
    </div>
  );
};

export default AnonSearch;
