import React, { useState } from 'react';
import './AllMessage.css';
import paperclip from '../../assets/icons/paperclip-2.svg';
import playcircle from '../../assets/icons/play-circle.svg';
import seen from '../../assets/icons/seen.svg';
import sent from '../../assets/icons/sent.svg';
import close from '../../assets/icons/modal-close.svg';
import undelivered from '../../assets/icons/undelivered.svg';
import active from '../../assets/icons/active-msg.svg';
import more from '../../assets/icons/chat-more.svg';
import maximize from '../../assets/icons/chat-maxi.svg';
import camera from '../../assets/icons/chat-camera.svg';
import microphone from '../../assets/icons/chat-microphone.svg';
import attatchSquare from '../../assets/icons/chat-attach-square.svg';
import gif from '../../assets/icons/emoji-happy.svg';
import minimize from '../../assets/icons/mini.svg';
import { useTheme } from '../../context/ThemeContext';
import { formatTimestamp } from './messageData';

import { useSelector, useDispatch } from 'react-redux';
import { setHideAllMsg, setMobileChats } from '../../redux/slices/mobileActionSlices';

import msgDp from '../../assets/images/message-user (5).png';

export default function MsgBox() {
  const MessageData = {
    id: 1,
    img: 'https://www.webxcreation.com/event-recruitment/images/profile-1.jpg',
    name: 'Shri Leena',
    message: '',
    status: {
      type: 'media',
      messageType: 'Received',
      chatType: 'personal',
      isArchieve: true,
      title: 'Sent a photo',
      count: 0,
      lastMessage: 'hello',
      owner: false,
      isNew: true,
      timestamp: '2023-08-14T07:05:33Z',
      active: false
    },
    isStory: true
  };
  const { isDarkMode } = useTheme();
  const [openChatModals, setOpenChatModals] = useState([]);
  const [additionalChatModals, setAdditionalChatModals] = useState([]);
  const [isChatMaximized, setIsChatMaximized] = useState(true);
  const [chatModals, setChatModals] = useState(MessageData.map(() => ({ isMaximized: true }))); // particular modal maximize as per id

  // const toggleChatSize = () => {
  //     setIsChatMaximized(!isChatMaximized);
  // };

  const toggleChatSize = (index, name) => {
    setChatModals((prevModals) => {
      const newModals = [...prevModals];
      newModals[1] = { isMaximized: !prevModals[1].isMaximized };
      return newModals;
    });
  };
  return (
    <div className="chat-modal" style={{ right: `${35 + 1 * 20}%`, bottom: `${1 * 0}px` }}>
      <div
        className={isDarkMode ? 'chat-modal-content' : 'd-chat-modal-content'}
        onClick={(e) => e.stopPropagation()}
        style={{
          height: chatModals[1]?.isMaximized ? '41.71vh' : '79vh',
          width: chatModals[1]?.isMaximized ? '16.66vw' : '41vw',
          padding: chatModals[1]?.isMaximized ? '5%' : '2.5%'
        }}
      >
        <div
          className="chat-box-header"
          style={{ gap: chatModals[1]?.isMaximized ? '0.5vw' : '1vw' }}
        >
          <div
            className="chat-profile-container"
            style={{ width: chatModals[1]?.isMaximized ? '1.66vw' : '1.875vw' }}
          >
            <img src={active} alt="User" className="chat-profile" />
          </div>
          <div className="chat-name-container">
            <p
              className={isDarkMode ? 'chat-name' : 'd-chat-name'}
              style={{ fontSize: chatModals[1]?.isMaximized ? '0.813rem' : '0.938rem' }}
            >
              something
            </p>
          </div>
          <div
            className="chat-actions-container"
            style={{ gap: chatModals[1]?.isMaximized ? '0.5vw' : '1vw' }}
          >
            <div className="chat-call-container">
              <p
                className="chat-call"
                style={{ fontSize: chatModals[1]?.isMaximized ? '0.813rem' : '0.938rem' }}
              >
                Call
              </p>
            </div>
            <div className="chat-more-container">
              <img src={more} alt="more" className="chat-more" />
            </div>
            <div className="chat-more-container">
              {chatModals[1]?.isMaximized ? (
                <div className="chat-more-container" onClick={() => toggleChatSize(1)}>
                  <img src={minimize} alt="minimize" className="chat-more" />
                </div>
              ) : (
                <div className="chat-more-container" onClick={() => toggleChatSize(1)}>
                  <img src={maximize} className="chat-more" alt="maximize" />
                </div>
              )}{' '}
            </div>
            <div className="chat-more-container">
              <img src={close} alt="close" className="chat-more" />
            </div>
          </div>
        </div>
        <div className="chat-container">
          <ul className="chat">
            <li>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div className="message-profile-contianer"></div>
                <div className="message left">
                  <p>I'm hungry!</p>
                </div>
              </div>
              <div className="message-profile-contianer">
                <img src={msgDp} alt="image" className="message-profile" />
                <span className="message-time">12.45pm</span>
              </div>
            </li>
            <li className="end2">
              <div className="message right">
                <p>Hi hungry, nice to meet you. I'm Dad.</p>
              </div>
              <span className="message-time-sender">12.45pm</span>
            </li>
            <li>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div className="message-profile-contianer"></div>
                <div className="message left">
                  <p>Dad I'm Serious!</p>
                </div>
              </div>
              <div className="message-profile-contianer">
                <img src={msgDp} alt="image" className="message-profile" />
                <span className="message-time">12.45pm</span>
              </div>
            </li>
            <li className="message right">
              <p>I thought your name was hungry...?</p>
            </li>
          </ul>
        </div>

        <div
          className={isDarkMode ? 'chat-box-footer' : 'd-chat-box-footer'}
          style={{
            padding: chatModals[1]?.isMaximized ? '2% 2% 0% 2%' : '2% 2% 1% 2%',
            gap: chatModals[1]?.isMaximized ? '.0.3vw' : '0.8vw'
          }}
        >
          <div
            className="chat-bottom-camera-container"
            style={{ width: chatModals[1]?.isMaximized ? '1.25vw' : '1.75vw' }}
          >
            <img src={camera} alt="camera" className="chat-bottom-camera" />
          </div>

          <div className="chat-bottom-input-container">
            <input
              type="text"
              className={isDarkMode ? 'chat-bottom-input' : 'd-chat-bottom-input'}
              placeholder="Type here..."
              style={{ fontSize: chatModals[1]?.isMaximized ? '0.813rem' : '0.938rem' }}
            />
          </div>

          <div
            className="chat-bottom-icons-container"
            style={{ width: chatModals[1]?.isMaximized ? '1.25vw' : '1.65vw' }}
          >
            <img src={microphone} alt="microphone" className="chat-bottom-icons" />
          </div>

          <div
            className="chat-bottom-icons-container"
            style={{ width: chatModals[1]?.isMaximized ? '1.25vw' : '1.65vw' }}
          >
            <img src={attatchSquare} alt="attach-sqare" className="chat-bottom-icons" />
          </div>

          <div
            className="chat-bottom-icons-container"
            style={{ width: chatModals[1]?.isMaximized ? '1.25vw' : '1.65vw' }}
          >
            <img src={gif} alt="gif" className="chat-bottom-icons" />
          </div>
        </div>
      </div>
    </div>
  );
}
