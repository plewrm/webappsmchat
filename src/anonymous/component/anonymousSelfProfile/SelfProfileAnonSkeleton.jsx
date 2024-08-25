import React from 'react';
import { Skeleton } from 'antd';
import { useTheme } from '../../../context/ThemeContext';
import styles from './SelfProfileAnonymous.module.css';

const SelfProfileAnonSkeleton = () => {
  const { isDarkMode } = useTheme();
  const skeletonItems = Array.from({ length: 3 });

  return (
    <>
      <div className={styles.ProfileBox}>
        <div>
          <Skeleton.Avatar
            size={64}
            active
            style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
          />
        </div>

        <div className={styles.userNameContainer}>
          <Skeleton.Input
            className={styles.userName}
            active
            size="small"
            style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A', width: '100px' }}
          />
        </div>

        <div className={styles.ageContainer}>
          <Skeleton.Input
            className={styles.age}
            active
            size="small"
            style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A', width: '200px' }}
          />
        </div>

        <div className={styles.languageBox}>
          {skeletonItems.map((_, index) => (
            <div key={index}>
              <Skeleton.Input
                className={styles.language}
                active
                size="small"
                style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A', width: '60px' }}
              />
            </div>
          ))}
        </div>

        <div
          className={styles.bioContainer}
          style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
        ></div>

        <div className={styles.HobbiesBox}>
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              style={{
                backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A',
                borderRadius: '50px'
              }}
            >
              <Skeleton.Input
                className={styles.Hobbies}
                active
                size="small"
                style={{ width: '80px' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px' }}>
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
    </>
  );
};

export default SelfProfileAnonSkeleton;
