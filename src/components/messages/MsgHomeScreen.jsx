import React, { useState } from 'react';
import styles from './MsgHomeScreen.module.css';
import addmessage from '../../assets/icons/message-add.svg';
import search from '../../assets/icons/search.svg';
import darkadd from '../../assets/icons/dark-add.svg';
import leftBack from '../../assets/icons/dark_mode_arrow_left.svg';
import { useTheme } from '../../context/ThemeContext';
import profile from '../../assets/images/profile-pic.png';
import { useDispatch } from 'react-redux';
import { setMessageHomeScreen } from '../../redux/slices/modalSlice';
import AllMessage from './AllMessage';
const MsgHomeScreen = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [innerActiveTab, setInnerActiveTab] = useState(1);
  const handleInnerTabClick = (tabNumber) => {
    setInnerActiveTab(tabNumber);
  };
  const closeMessageChat = () => {
    dispatch(setMessageHomeScreen(false));
  };

  return (
    <div className={isDarkMode ? styles.msgContainer : styles['d-msgContainer']}>
      <div className={styles.msgHeader}>
        <div className={styles.headerContainer}>
          <p className={isDarkMode ? styles.header : styles['d-header']}>Chats</p>
        </div>
      </div>

      <AllMessage applyClass={true} />

      {/* <div className={styles.searchContainers}>
                <div className={styles.backContainer}>
                    <img src={leftBack} alt='back' className={styles.back} onClick={closeMessageChat}/>
                </div>
                <div className={isDarkMode ? styles.searchBar : styles['d-searchBar']}>
                    <div className={styles.searchIconContainer}>
                        <img src={search} alt='search' className={styles.searchIcon} />
                    </div>
                    <input className={isDarkMode ? styles.inputSearch : styles['d-inputSearch']} placeholder='Search message, people and groups' />
                </div>
            </div>

            <div className={isDarkMode ? styles.InnerTabContainer : styles['d-InnerTabContainer']}>
                <div className={styles.InnerTabBox} onClick={() => handleInnerTabClick(1)} style={{ background: innerActiveTab === 1 ? '#332E41' : '' }}>
                    <p className={isDarkMode ? styles.InnerTab : styles['d-InnerTab']}>New Chat</p>
                </div>
                <div className={styles.InnerTabBox} onClick={() => handleInnerTabClick(2)} style={{ background: innerActiveTab === 2 ? '#332E41' : '' }}>
                    <p className={isDarkMode ? styles.InnerTab : styles['d-InnerTab']}>New Group</p>
                </div>
            </div>

            {innerActiveTab === 1 && (
                <>
                    <div className={styles.chatTitleContainer}>
                        <p className={isDarkMode ? styles.chatTitle : styles['d-chatTitle']}>Recent</p>
                    </div>

                    <div className={styles.ChatContainer}>
                        <div className={styles.ChatBox}>
                            <div className={styles.profileContainer}>
                                <img src={profile} alt='image' className={styles.profile} />
                            </div>
                            <div className={styles.nameContainer}>
                                <p className={isDarkMode ? styles.name : styles['d-name']}>Piyush Mathur</p>
                            </div>
                        </div>
                    </div>
                </>
            )} */}
    </div>
  );
};

export default MsgHomeScreen;
