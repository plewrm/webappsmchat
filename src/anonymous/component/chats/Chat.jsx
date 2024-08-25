import React, { useEffect, useState } from 'react';
import styles from './Chat.module.css';
import search from '../../../assets/anonymous/icon/search-normal.svg';
import leftBack from '../../../assets/icons/dark_mode_arrow_left.svg';
import ChatComponent from './ChatComponent';
import { BASE_URL, BEARER_TOKEN, SENDGETMESSAGETOMATCH } from '../../../api/EndPoint';
import SpinbuzzMessage from '../../../modals/SpinbuzzMessage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAnonMessageMobile } from '../../../redux/slices/mobileActionSlices';

export default function Chat() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('All');
  const globalSpinBuzzState = useSelector((state) => state.community.globalSpinBuzzState);
  // console.log(globalSpinBuzzState)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  useEffect(() => {
    const getConvo = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        };
        const response = await axios.get(`${BASE_URL}${SENDGETMESSAGETOMATCH}`, { headers });
        setChats(response.data.conversations.reverse());
        setFilteredChats(response.data.conversations);
      } catch (err) {
        console.log(err);
      }
    };
    getConvo();
  }, [globalSpinBuzzState]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof searchUser === 'string' && searchUser.trim().length > 0) {
        const filterChats = chats.filter((chat) =>
          chat.username.toLowerCase().includes(searchUser.toLowerCase())
        );
        setFilteredChats(filterChats);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchUser, chats]);
  const [anonChat, setAnonChat] = useState(null);
  const handleClick = (content) => {
    setAnonChat(content); // Set anonChat to content when clicked
  };
  const handleClose = () => {
    setAnonChat(null); // Reset anonChat when SpinbuzzMessage requests to close
  };

  const handleBackArrow = () => {
    dispatch(setAnonMessageMobile(false));
  };

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <div className={styles.Chat}>
        <div className={styles.searchBarFlex}>
          {isMobileView && (
            <img src={leftBack} alt="back" className={styles.backArrow} onClick={handleBackArrow} />
          )}
          <div className={styles.searchBar}>
            <div className={styles.searchIconContainer}>
              <img src={search} alt="search" className={styles.searchIcon} />
            </div>
            <input
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className={styles.inputSearch}
              placeholder="Search Conversations"
            />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.ChatContainer}>
            {chats.length === 0 ? (
              <div className={styles.NoChatTextContainer}>
                <span className={styles.NoChatText}>No Message Yet!</span>
              </div>
            ) : (
              <>
                {filteredChats &&
                  filteredChats.map((chat, index) => {
                    if (!chat) return <></>;
                    return (
                      <div key={index} onClick={() => handleClick(chat)}>
                        <ChatComponent content={chat} />
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </div>
      {anonChat && <SpinbuzzMessage profile={anonChat} handleClose={handleClose} />}
    </>
  );
}
