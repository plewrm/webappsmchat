import React from 'react';
import './ViewRepost.css';
import { useTheme } from '../../../context/ThemeContext';
import repostIcon from '../../../assets/icons/repeat.svg';
import close from '../../../assets/icons/modal-close.svg';
import search from '../../../assets/icons/searchDark.svg';

const ViewRepost = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={isDarkMode ? 'viewRepostScreen' : 'd-viewRepostScreen'}>
      <div className="Viewrepost-header">
        <div className="viewRepostHeaderIcon">
          <img src={repostIcon} alt="repost" className="viewRepostIcon" />
        </div>
        <div className="viewRepostTitleContainer">
          <p className={isDarkMode ? 'viewRepostTitle' : 'd-viewRepostTitle'}>Reposts</p>
        </div>
        <div className="viewRepostHeaderCloseIcon">
          <img
            src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
            alt="close"
            className="viewRepostClose"
          />
        </div>
      </div>

      <div className=""></div>
    </div>
  );
};

export default ViewRepost;
