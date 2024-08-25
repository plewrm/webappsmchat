import React, { useState, useRef, useEffect } from 'react';
import './Message.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import addmessage from '../../assets/icons/message-add.svg';
import setting from '../../assets/icons/setting-2.svg';
import search from '../../assets/icons/search.svg';
import darksetting from '../../assets/icons/dark-setting.svg';
import darkadd from '../../assets/icons/dark-add.svg';
import AllMessage from './AllMessage';
import Archives from './Archives';
import Greetings from './Greetings';
import { selectActiveTab, setActiveTab } from '../../redux/slices/messageTabsSlices';
import leftArrow from '../../assets/images/arrow-left.png';
import {
  setIsMobile,
  setMobileChats,
  setHideAllMsg,
  setMessageMobile
} from '../../redux/slices/mobileActionSlices';
import { sethomeTab, setmessageTab } from '../../redux/slices/topBarSlices';
import { MessageData } from './messageData';
import GroupMessages from './GroupMessages';
import MobileChats from './mobileChats/MobileChats';
import AddMessageGroups from './AddMessageGroups';
import toggleDown from '../../assets/icons/arrow-square-down.svg';
import toggleUp from '../../assets/icons/arrow-square-up.svg';
import { toggleExpand } from '../../redux/slices/chatSlice';
import { useNavigate } from 'react-router-dom';
const Message = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isAddClicked, setIsAddClicked] = useState(false);
  const activeTab = useSelector(selectActiveTab);
  const [prevActiveTab, setPrevActiveTab] = useState(1); // State to track the previous active tab
  const dispatch = useDispatch();
  const archiveMessages = MessageData.filter((item) => item.status.isArchieve); // to show archieve message
  const groupMessages = MessageData.filter((item) => item.status.chatType === 'group'); // to show group message
  const expanded = useSelector((state) => state.chat.expanded);

  const handleTabClick = (tabId) => {
    setPrevActiveTab(activeTab); // Save the current active tab as the previous tab
    dispatch(setActiveTab(tabId));
  };

  const handleGreetingsBackClick = () => {
    dispatch(setActiveTab(prevActiveTab)); // Set the active tab to the previous tab
  };

  const handleAddClick = () => {
    setIsAddClicked(true);
  };

  const handleBackClick = () => {
    setIsAddClicked(false);
  };

  const goToHome = () => {
    dispatch(setMessageMobile(false));
  };

  return (
    <div>
      <div className={isDarkMode ? 'message-container' : 'd-message-container'}>
        {/* <div className='message-header-container'>
          <div className='chat-title-container'>
            <img onClick={goToHome} src={leftArrow} alt='back'></img>
            <p className={isDarkMode ? 'chat-title' : 'd-chat-title'}>Chats</p>
          </div>

          <div className='message-action-container'>
            <div className='message-add-icon-container' onClick={handleAddClick}>
              {isDarkMode ? <img src={darkadd} alt='add' className='message-add-icon' /> : <img src={addmessage} alt='add' className='message-add-icon' />}

            </div>

            <div className='message-add-icon-container'>
              {isDarkMode ? <img src={darksetting} alt='setting' className='message-add-icon' /> : <img src={setting} alt='setting' className='message-add-icon' />}
            </div>
          </div>
        </div> */}

        {isAddClicked && <AddMessageGroups handleBackClick={handleBackClick} />}

        {!isAddClicked && <></>}
        {!isAddClicked && (
          <div className="tabs-content-container">
            {activeTab === 1 && (
              <div>
                <AllMessage MessageData={MessageData} />
              </div>
            )}
            {activeTab === 2 && (
              <div>
                <GroupMessages groupMessages={groupMessages} />
              </div>
            )}
            {activeTab === 3 && (
              <div>
                {' '}
                <Archives archiveMessages={archiveMessages} />
              </div>
            )}
            {activeTab === 4 && (
              <div>
                <Greetings handleGreetingsBackClick={handleGreetingsBackClick} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
