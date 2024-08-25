import React from 'react';
import { Skeleton } from 'antd';
import { useTheme } from '../../context/ThemeContext';
import './Notification.css';

const NotificationSkeleton = () => {
  const { isDarkMode } = useTheme();
  const skeletonItems = Array.from({ length: 20 });

  return (
    <>
      <div className="outsidebox-Nf">
        {skeletonItems.map((_, index) => (
          <div key={index} className="nf-outer-box">
            <div
              className="nf-profile-pic-container"
              style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
            >
              <Skeleton.Avatar className="nf-profile-pic" size="large" active />
            </div>
            <div className="nf-alltext-container">
              <Skeleton.Input
                className={isDarkMode ? 'mentioned-nf' : 'd-mentioned-nf'}
                active
                size="small"
                style={{
                  width: '200px',
                  marginTop: '8px',
                  backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A'
                }}
              />
            </div>
            <div className="nf-right-box">
              <Skeleton.Avatar
                className="noti-media"
                shape="square"
                size={30}
                active
                style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationSkeleton;
