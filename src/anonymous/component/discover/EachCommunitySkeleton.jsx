import React from 'react';
import { Skeleton, Button } from 'antd';
import styles from '../discover/CreateCommunity.module.css';
import { useTheme } from '../../../context/ThemeContext';
const EachCommunitySkeleton = () => {
  const isDarkMode = useTheme();
  return (
    <>
      <div className={styles.hsComponent}>
        <>
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <div className={styles.profileBackIconContainer}></div>
            </div>
            <div className={styles.profileInfoContainer}>
              <div style={{ marginTop: '20px' }}>
                <Skeleton.Avatar
                  active
                  size={64}
                  shape="circle"
                  style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <Skeleton.Input
                  active
                  size="default"
                  style={{ width: '100px', backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <Skeleton.Input
                  active
                  size="default"
                  style={{ width: '200px', backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: '20px', backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
                />
              </div>
              <Button
                className={styles.profileJoinedButton}
                style={{ backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
                active
                shape="round"
              ></Button>
            </div>
            <div className={styles.profileTabContainer}>
              <Button
                className={styles.tabButton}
                shape="round"
                style={{
                  marginRight: '5px',
                  backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A'
                }}
                active
              ></Button>
              <Button
                className={styles.tabButton}
                shape="round"
                style={{ marginLeft: '5px', backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
                active
              ></Button>
            </div>
            <div style={{ color: '#FCFCFC', textAlign: 'center', paddingTop: '5%' }}>
              <Skeleton.Input
                active
                size="default"
                style={{ width: 300, backgroundColor: isDarkMode ? '#F2F2F2' : '#E1E1E11A' }}
              />
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default EachCommunitySkeleton;
