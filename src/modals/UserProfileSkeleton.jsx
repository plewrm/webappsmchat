import React, { useState } from 'react';
import { Skeleton } from 'antd';
import { useTheme } from '../context/ThemeContext';
import './UserProfile.css';
import UserPostSkeleton from '../components/pages/userpost/UserPostSkeleton';
const UserProfileSkeleton = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <div className={isDarkMode ? 'userprofile-container' : 'd-userprofile-container'}>
        <div>
          <div
            className="user-cover-container"
            style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
          ></div>

          <div className="user-profile-count-container">
            <div className="users-profile-container">
              <Skeleton.Avatar
                className={isDarkMode ? 'user-profile' : 'd-user-profile'}
                size={64}
              />
            </div>
            <div
              style={{ paddingTop: '40px', backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
              className={isDarkMode ? 'revealp-count-box' : 'd-revealp-count-box'}
            >
              <div className="revealp-count-innerbox">
                <div className="revealp-count-column"></div>

                <div className="revealp-count-column"></div>

                <div className="revealp-count-column"></div>
              </div>
            </div>
          </div>

          <div className="user-box1-outer">
            <div className="user-box1">
              <div className="user-name-container">
                <Skeleton.Input
                  className={isDarkMode ? 'user-name' : 'd-user-name'}
                  active
                  size="small"
                  style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
                />
              </div>
            </div>

            <div className="user-id-container">
              <Skeleton.Input
                active
                size={20}
                style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
              />
            </div>

            <div className="user-bio-container">
              <Skeleton.Input
                active
                size={20}
                style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
              />
            </div>

            <div className="user-bio-container">
              <Skeleton.Input
                active
                size={20}
                style={{
                  whiteSpace: 'pre-line',
                  backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A'
                }}
              />
            </div>
          </div>

          <div className="user-button-container2">
            <Skeleton.Input
              active
              size="large"
              style={{ width: '100%', backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
            />
            <Skeleton.Input
              active
              size="large"
              style={{ width: '100%', backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
            />
          </div>
        </div>

        <UserPostSkeleton />
      </div>
    </>
  );
};

export default UserProfileSkeleton;
