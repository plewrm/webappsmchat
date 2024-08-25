import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../UserProfile.css';
import closeTrans from '../../assets/icons/s-close.svg';
import noCover from '../../assets/images/plain-cover.png';
import noProfile from '../../assets/icons/Default_pfp.webp';
import { useTheme } from '../../context/ThemeContext';
import { setViewCover, setViewProfile } from '../../redux/slices/modalSlice';
const UserProfileImage = ({ userDetails }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const viewCover = useSelector((state) => state.modal.viewCover);
  const viewProfile = useSelector((state) => state.modal.viewProfile);

  const handleCloseCover = () => {
    dispatch(setViewCover(false));
  };
  const handleCloseProfie = () => {
    dispatch(setViewProfile(false));
  };

  return (
    <div>
      {viewCover && (
        <div className={isDarkMode ? 'viewCoverContainer' : 'd-viewCoverContainer'}>
          <div className="coverClose" onClick={handleCloseCover}>
            <img src={closeTrans} alt="close" className="coverCloseIcon" />
          </div>
          <div className={isDarkMode ? 'viewCoverBox' : 'd-viewCoverBox'}>
            <img
              src={userDetails.cover_photo ? userDetails.cover_photo : noCover}
              className="viewCover"
            />
          </div>
        </div>
      )}

      {viewProfile && (
        <div className={isDarkMode ? 'viewCoverContainer' : 'd-viewCoverContainer'}>
          <div className="coverClose" onClick={handleCloseProfie}>
            <img src={closeTrans} alt="close" className="coverCloseIcon" />
          </div>
          <div className={isDarkMode ? 'viewProfileBox' : 'd-viewProfileBox'}>
            <img src={userDetails.pfp ? userDetails.pfp : noProfile} className="viewProfile" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileImage;
