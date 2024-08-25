import React, { useState } from 'react';
import './Greetings.css';
import './AllMessage.css';
import darkBack from '../../assets/icons/dark_mode_arrow_left.svg';
import lightBack from '../../assets/icons/light_mode_arrow_left.svg';
import { useTheme } from '../../context/ThemeContext';
import darkRight from '../../assets/icons/dark-right-icon.svg';
import lightRight from '../../assets/icons/light-right-icon.svg';
import seen from '../../assets/icons/seen.svg';
import sent from '../../assets/icons/sent.svg';
import undelivered from '../../assets/icons/undelivered.svg';
import more from '../../assets/icons/More.png';
import { Popover } from 'antd';

const Greetings = ({ handleGreetingsBackClick }) => {
  const { isDarkMode } = useTheme();
  const [showHiddenChat, setShowHiddenChat] = useState(false);

  const MessageData = [
    {
      id: 1,
      img: 'https://www.webxcreation.com/event-recruitment/images/profile-1.jpg',
      name: 'Shri Leena',
      message: '',
      status: {
        type: 'media',
        messageType: 'Received',
        title: 'You Shared a link',
        count: 1,
        lastMessage: 'hello',
        owner: false,
        isNew: true,
        timestamp: '2023-08-14T07:05:33Z'
      }
    },
    {
      id: 2,
      img: 'https://images.freeimages.com/image/previews/88f/png-design-for-your-instagram-profile-button-stand-out-with-a-unique-and-eye-catching-design-that-captures-attention-5690390.png',
      name: 'Blocked User',
      message: '',
      status: {
        type: 'text',
        messageType: 'Seen',
        title: 'Seen',
        count: 10,
        lastMessage: 'hello',
        owner: false,
        isNew: true,
        timestamp: '2023-08-09T05:46:52Z'
      }
    }
  ];

  const formatTimestamp = (timestamp) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', options);
    return formattedTime;
  };

  const openHiddenChat = () => {
    setShowHiddenChat(true);
  };
  const closeHiddenChat = () => {
    setShowHiddenChat(false);
  };

  const content = (
    <div>
      <div className="delete-this-chat-container">
        <p className={isDarkMode ? 'delete-this-chat' : 'd-delete-this-chat'}>Delete This Chat</p>
      </div>
      <div className="hide-this-chat-container">
        <p className={isDarkMode ? 'hide-this-chat' : 'd-hide-this-chat'}>Hide This Chat</p>
      </div>
    </div>
  );

  return (
    <div className="greeting-container">
      {!showHiddenChat && (
        <>
          <div className="greeting-header">
            <div className="greeting-left-container">
              <div className="greeting-back-container">
                <div onClick={handleGreetingsBackClick}>
                  {isDarkMode ? (
                    <img src={lightBack} alt="image" className="greeting-back-icon" />
                  ) : (
                    <img src={darkBack} alt="image" className="greeting-back-icon" />
                  )}
                </div>
              </div>
              <div className="header-left-text-container">
                <p className={isDarkMode ? 'header-left-text' : 'd-header-left-text'}>Greetings</p>
                {/* <div className='greeting-count-container'>
                  <span className='greeting-count'>0</span>
                </div> */}
                <div className="notification">
                  <span className="badge">5</span>
                </div>
              </div>
            </div>

            <div className="greeting-right-container" onClick={openHiddenChat}>
              <div className="greeting-forward-container">
                <div className="hidden-text-container">
                  <p className={isDarkMode ? 'hidden-text' : 'd-hidden-text'}>Hidden 2</p>
                </div>

                <div className="greeitng-right-icon-container">
                  {isDarkMode ? (
                    <img src={darkRight} className="greeting-right-icon" alt="image" />
                  ) : (
                    <img src={lightRight} className="greeting-right-icon" alt="image" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="greeting-message-container">
            {MessageData.map((item) => (
              <div className="greeting-message-box" key={item.id}>
                <div className="msg-photo-container">
                  <img src={item.img} alt="image" className="message-photo-container" />
                </div>

                <div className="all-message-container-2">
                  <div className="all-message-container-21">
                    <div className="all-message-name-container">
                      <p className={isDarkMode ? 'all-message-name' : 'd-all-message-name'}>
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="all-message-container-22">
                    {item.status.messageType === 'Sent' && (
                      <div className="seen-container">
                        <img src={sent} alt="sent" className="seen-img" />
                      </div>
                    )}

                    {item.status.messageType === 'Seen' && (
                      <div className="seen-container">
                        <img src={seen} alt="seen" className="seen-img" />
                      </div>
                    )}

                    {item.status.messageType === 'SentError' && (
                      <div className="seen-container">
                        <img src={undelivered} alt="undelivered" className="seen-img" />
                      </div>
                    )}
                    <div className="user-message-container">
                      <p className={isDarkMode ? 'user-message' : 'd-user-message'}>
                        {item.status.title}
                      </p>
                    </div>

                    <div className="msg-time-container">
                      <p className={isDarkMode ? 'msg-time' : 'd-msg-time'}>
                        {formatTimestamp(item.status.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
                <Popover
                  placement="leftTop"
                  content={content}
                  className={isDarkMode ? 'popover-chat' : 'd-popover-chat'}
                >
                  <div className="greeting-more-option-container">
                    <img src={more} alt="more" className="greeting-more-option" />
                  </div>
                </Popover>
              </div>
            ))}
          </div>
        </>
      )}

      {showHiddenChat && (
        <>
          <div className="greeting-header">
            <div className="greeting-left-container">
              <div className="greeting-back-container">
                <div onClick={closeHiddenChat}>
                  {isDarkMode ? (
                    <img src={lightBack} alt="image" className="greeting-back-icon" />
                  ) : (
                    <img src={darkBack} alt="image" className="greeting-back-icon" />
                  )}
                </div>
              </div>
              <div className="header-left-text-container">
                <div className="hidden-text-container" onClick={openHiddenChat}>
                  <p className={isDarkMode ? 'hidden-text' : 'd-hidden-text'}>Hidden</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Greetings;
