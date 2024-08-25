import React from 'react';
import './AllMessage.css';
import paperclip from '../../assets/icons/paperclip-2.svg';
import playcircle from '../../assets/icons/play-circle.svg';
import seen from '../../assets/icons/seen.svg';
import sent from '../../assets/icons/sent.svg';
import undelivered from '../../assets/icons/undelivered.svg';
import active from '../../assets/icons/active-msg.svg';
import { useTheme } from '../../context/ThemeContext';

const GroupMessages = ({ groupMessages }) => {
  const { isDarkMode } = useTheme();

  const formatTimestamp = (timestamp) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', options);
    return formattedTime;
  };

  return (
    <div>
      <div className="all-message-container">
        {groupMessages?.map((item) => (
          <div className="all-message-box" key={item.id}>
            <div className="msg-photo-container">
              <img src={item.img} alt="image" className="message-photo-container" />

              {item.status.active === true && (
                <div className="active-status-container">
                  <img src={active} alt="active" className="active-status" />
                </div>
              )}
            </div>

            <div className="all-message-container-2">
              <div className="all-message-container-21">
                <div className="all-message-name-container">
                  <p className={isDarkMode ? 'all-message-name' : 'd-all-message-name'}>
                    {item.name}
                  </p>
                </div>

                {item.status.type === 'media' && (
                  <div className="paperclip-container">
                    <img src={paperclip} alt="papercircle" className="paperclip" />
                  </div>
                )}
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

            <div className="playcircle-container">
              <img src={playcircle} alt="playcircle" className="playcircle" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMessages;
