import React from 'react';
import Message from './Message';
import { useDispatch, useSelector } from 'react-redux';
import { toggleExpand } from '../../redux/slices/chatSlice';
import { useTheme } from '../../context/ThemeContext';

const MessageToggle = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const expanded = useSelector((state) => state.chat.expanded);
  return (
    <div>
      <div className={isDarkMode ? 'msg-bottom-toggle' : 'd-msg-bottom-toggle'}>
        <div
          className={`${isDarkMode ? 'msg-toggle-container' : 'd-msg-toggle-container'} ${expanded ? 'toggleExpanded' : ''}`}
        >
          <div
            onClick={() => dispatch(toggleExpand())}
            className={isDarkMode ? 'msg-toggle' : 'd-msg-toggle'}
          >
            <div className="toggle-chatsContainer">
              <p className={isDarkMode ? 'toggle-Chats' : 'd-toggle-Chats'}>Chats</p>
            </div>
            <div className="toggle-ImgContainer">
              <img
                src={
                  expanded
                    ? isDarkMode
                      ? '/lightIcon/arrowUpLight.svg'
                      : '/darkIcon/arrowDownDark.svg'
                    : isDarkMode
                      ? '/lightIcon/arrowDownLight.svg'
                      : '/darkIcon/arrowUpDark.svg'
                }
                alt="down"
                className="toggle-Img"
              />
            </div>
          </div>
          <div className="msg-toggle-content">
            <Message />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageToggle;
