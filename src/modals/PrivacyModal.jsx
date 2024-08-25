import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './CreatePost.css';
import global from '../assets/icons/globals.svg';
import friends from '../assets/icons/friends.svg';
import friendsOnly from '../assets/icons/friends-only.svg';
import untick from '../assets/anonymous/icon/uselect-circle.svg';
import tick from '../assets/anonymous/icon/select-Circle.svg';
const PrivacyModal = () => {
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className={isDarkMode ? 'openMoreModal' : 'd-openMoreModal'}>
      <div className="privacy-modal-container">
        <div className="privacy-header-container">
          <p className={isDarkMode ? 'privacy-header' : 'd-privacy-header'}>Choose Audience</p>
        </div>

        <div className="cp-privacy-box" onClick={() => handleOptionClick('public')}>
          <div className="cp-privacy-icon-container">
            <img src={global} className="cp-privacy-icon" alt="icon" />
          </div>
          <div className="cp-privacy-content-container">
            <p className={isDarkMode ? 'cp-privacy-content' : 'd-cp-privacy-content'}>Public</p>
          </div>
          <div className="cp-untick-icon-container">
            <img
              src={selectedOption === 'public' ? tick : untick}
              className="cp-untick-icon"
              alt="untick"
            />
          </div>
        </div>

        <div className="cp-privacy-box" onClick={() => handleOptionClick('friends')}>
          <div className="cp-privacy-icon-container">
            <img src={friends} className="cp-privacy-icon" alt="icon" />
          </div>
          <div className="cp-privacy-content-container">
            <p className={isDarkMode ? 'cp-privacy-content' : 'd-cp-privacy-content'}>
              Friends & Followers
            </p>
          </div>
          <div className="cp-untick-icon-container">
            <img
              src={selectedOption === 'friends' ? tick : untick}
              className="cp-untick-icon"
              alt="untick"
            />
          </div>
        </div>

        <div className="cp-privacy-box" onClick={() => handleOptionClick('friendsOnly')}>
          <div className="cp-privacy-icon-container">
            <img src={friendsOnly} className="cp-privacy-icon" alt="icon" />
          </div>
          <div className="cp-privacy-content-container">
            <p className={isDarkMode ? 'cp-privacy-content' : 'd-cp-privacy-content'}>
              Friends Only
            </p>
          </div>
          <div className="cp-untick-icon-container">
            <img
              src={selectedOption === 'friendsOnly' ? tick : untick}
              className="cp-untick-icon"
              alt="untick"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
